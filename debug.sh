

while true; do
    ts-node index.ts
    [$? == 123] || break
done