#Parameters
locationsInputFile="../../helper/src/locations.json"
skuFamiliesInputFile="../../helper/src/skuFamilies.json"
skuOutputFile="../../helper/src/vmSKUs.json"
ephMinCacheSizeGB=137
minCPUs=2
maxCPUs=8

#Variables
SubscriptionId=$(az account show --query id -o tsv)

#Load Files
locations=$(cat $locationsInputFile | jq) ##Get Locations
skuFamilies=$(cat $skuFamiliesInputFile | jq) #Get Virtual Machine SKU Families


#Loop through sku families
for fam in $(echo "${skuFamilies}" | jq -r '.[] | @base64'); do
    _jqfam() {
    echo ${fam} | base64 --decode | jq -r ${1}
    }
    familyFilter="familyName%20eq%20'$(_jqfam '.key')'"
    computeType=$(_jqfam '.computeType')

    #Loop through Locations
    for loc in $(echo "${locations}" | jq -r '.[] | @base64'); do
        _jqloc() {
        echo ${loc} | base64 --decode | jq -r ${1}
        }
        location=$(_jqloc '.key') #location

        #Only call API for locations and not groups of locations
        if [[ $(_jqloc 'has("itemType")') == false ]];
        then
            jq -n \
            --arg key "$(_jqfam '.key')" \
            --arg text "$(_jqfam '.text')" \
            --arg itemType 2 \
            --arg location "$location" \
            --arg computeType "$computeType" \
            --arg eph false \
            '{key: $key, text: $text, itemType: $itemType | tonumber, eph: $eph | test("true"), location: $location, computeType: $computeType}'

            #Call API to retrieve list of sku's for location
            reqUrl="https://management.azure.com/subscriptions/$SubscriptionId/providers/Microsoft.Batch/locations/$location/virtualMachineSkus?\$filter=$familyFilter&api-version=2022-06-01"
            skus=$(az rest --method GET --uri $reqUrl)


            #Loop through sku's returned by the API
            for row in $(echo "${skus}" | jq -r '.value[] | @base64'); do
                _jq() {
                echo ${row} | base64 --decode | jq -r ${1}
                }
                name=$(_jq '.name')
                osSize=$(echo $(_jq) | jq -r     '.capabilities | .[] | select(.name=="OSVhdSizeMB") | .value')
                cpu=$(echo $(_jq) | jq -r        '.capabilities | .[] | select(.name=="vCPUs") | .value')
                ram=$(echo $(_jq) | jq -r        '.capabilities | .[] | select(.name=="MemoryGB") | .value')
                cachedSize=$(echo $(_jq) | jq -r '.capabilities | .[] | select(.name=="CachedDiskBytes") | .value')
                iops=$(echo $(_jq) | jq -r       '.capabilities | .[] | select(.name=="CombinedTempDiskAndCachedIOPS") | .value')

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
                    cache=", $cacheGB cache ($iops IOPS)"
                    if [[ cacheGB -ge $ephMinCacheSizeGB ]];
                    then
                        eph=true
                    else
                        eph=false
                    fi
                fi
                text="[$name]: $cpu vCPU, $ram RAM, $osSizeGB SSD $cache"

                if [[ cpu -ge $minCPUs && cpu -le $maxCPUs ]];
                then
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
        fi
    done
done | jq -n '[inputs]'  > $skuOutputFile
