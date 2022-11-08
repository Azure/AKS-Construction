begin=$(date +"%s")
echo "Creating Sku list..."

#Parameters
locationsInputFile="../../helper/src/locations.json"
skuFamiliesInputFile="../../helper/src/skuFamilies.json"
skuOutputFile="../../helper/src/vmSKUs.json"
tempFile="tempSkus.json"
ephMinCacheSizeGB=137
minCPUs=2
maxCPUs=8

#Variables
SubscriptionId=$(az account show --query id -o tsv)

#if subscription id is null
if [ -z "$SubscriptionId" ]; then exit 1; fi

echo "Using SubscriptionId $SubscriptionId"

#Load Files
locations=$(cat $locationsInputFile | jq) ##Get Locations
skuFamilies=$(cat $skuFamiliesInputFile | jq) #Get Virtual Machine SKU Families

#Loop through sku families
for loc in $(echo "${locations}" | jq -r '.[] | @base64'); do
    _jqloc() {
    echo ${loc} | base64 --decode | jq -r ${1}
    }
    location=$(_jqloc '.key') #location
    locationFilter="location%20eq%20'$location'"
    #Only call API for locations and not groups of locations
    if [[ $(_jqloc 'has("itemType")') == false ]];
    then
        reqUrl="https://management.azure.com/subscriptions/$SubscriptionId/providers/Microsoft.Compute/skus?api-version=2021-07-01&\$filter=$locationFilter"
        skus=$(az rest --method GET --uri $reqUrl)

        #Looking to reduce the json object size for performance
        skus=$(echo "${skus}" | jq -r --argjson family "$skuFamilies"  '.value[] | select(.resourceType == "virtualMachines") | select(.family|  IN($family[].key) )')

        for fam in $(echo "${skuFamilies}" | jq -r '.[] | @base64'); do
            _jqfam() {
            echo ${fam} | base64 --decode | jq -r ${1}
            }
            family=$(_jqfam '.key')
            computeType=$(_jqfam '.computeType')

            jq -n \
            --arg key "$family" \
            --arg text "$(_jqfam '.text')" \
            --arg itemType 2 \
            --arg location "$location" \
            --arg computeType "$computeType" \
            --arg eph false \
            '{key: $key, text: $text, itemType: $itemType | tonumber, eph: $eph | test("true"), location: $location, computeType: $computeType}'

            for row in $(echo "${skus}" | jq -r --arg family "$family" 'select(.family == $family) |  @base64'); do
                _jq() {
                echo ${row} | base64 --decode | jq -r ${1}
                }
                cpu=$(echo $(_jq) | jq -r        '.capabilities | .[] | select(.name=="vCPUs") | .value')
                if [[ cpu -ge $minCPUs && cpu -le $maxCPUs ]];
                then
                    name=$(_jq '.name')
                    osSize=$(echo $(_jq) | jq -r     '.capabilities | .[] | select(.name=="OSVhdSizeMB") | .value')
                    ram=$(echo $(_jq) | jq -r        '.capabilities | .[] | select(.name=="MemoryGB") | .value')
                    cachedSize=$(echo $(_jq) | jq -r '.capabilities | .[] | select(.name=="CachedDiskBytes") | .value')

                    #Convert to GB
                    osSizeGB=$(( osSize/1024 ))
                    cacheGB=$(( cachedSize/1073741824 ))

                    #Build text property
                    cacheGB=$((cacheGB + 0))
                    if [[ cacheGB -eq 0  ]];
                    then
                        cache=""
                        eph=false
                    else
                        iops=$(echo $(_jq) | jq -r       '.capabilities | .[] | select(.name=="CombinedTempDiskAndCachedIOPS") | .value')
                        cache=", $cacheGB cache ($iops IOPS)"
                        if [[ cacheGB -ge $ephMinCacheSizeGB ]];
                        then
                            eph=true
                        else
                            eph=false
                        fi
                    fi
                    text="[$name]: $cpu vCPU, $ram RAM, $osSizeGB SSD $cache"

                    #Create JSON
                    jq -n \
                    --arg key "$name" \
                    --arg text "$text" \
                    --arg eph $eph \
                    --arg location "$location" \
                    --arg computeType "$computeType" \
                    '{key: $key, text: $text, eph: $eph | test("true"), location: $location, computeType: $computeType}'
                fi
            done
        done
    fi
done | jq -n '[inputs]'  > $tempFile
mv $tempFile $skuOutputFile

#Write out durable of script execution
termin=$(date +"%s")
difftimelps=$(($termin-$begin))
echo "$(($difftimelps / 60)) minutes and $(($difftimelps % 60)) seconds elapsed for Script Execution."
