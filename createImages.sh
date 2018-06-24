

for file in ./img/*.jpg; do
    IFS='.' read -ra NAME <<< "$file" 
    IFS='/' read -ra NUMBER <<< ${NAME[1]}
    IFS=" " read -ra FINAL <<< ${NUMBER[0]}
    echo "${FINAL[1]}"
    convert "${file}" -resize 480 -quality 75 img/"${FINAL[1]}"-480w.jpg
    convert "${file}" -resize 320 -quality 75 img/"${FINAL[1]}"-320w.jpg
done