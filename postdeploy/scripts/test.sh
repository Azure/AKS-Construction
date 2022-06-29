#!/bin/bash


get_image_property () {

    dependenciesJson=$(cat $1)
    arrKey=(${2//./ })
    nk=false
    n=-1
    l=()
    while IFS="[: ,]+" read -ra tokens; do
        for i in "${tokens[@]}"; do
            if [ "$i" = "{" ]; then
            ((n+=1))
            nk=true
            elif  [ "$i" = "}" ]; then
            ((n-=1))
            else
            if $nk; then
                #echo "new key $n - $i"
                l[$n]=$(echo $i | tr -d '"')
                nk=false
            else
                print=true
                #echo "testing:  n=$n"
                for o in $(seq 0 $n); do

                    #echo "testing:  ${l[$o]} = ${arrKey[$o]}"
                    if [[ ! ${l[$o]} = ${arrKey[$o]} ]]; then
                    print=false
                    break
                    fi
                done
                if $print; then
                echo -n $i | tr -d '"'
                fi
                nk=true
            fi
            fi
        done
    done <<<$dependenciesJson
}

TEST=$(get_image_property $1 "externaldns.1_9_0.images.image.repository")
echo $TEST