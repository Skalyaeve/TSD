if [ -d "/mnt/c" ]; then
    hostIp=$(ip addr | grep 'inet.*eth0' | cut -d' ' -f6 | cut -d'/' -f1)
    echo "On WSL"
else
    hostIp=$(ip addr | grep 'inet 10.' | cut -d' ' -f6 | cut -d'/' -f1)
    echo "Not on WSL"
fi
cat ./.env | grep -v 'HOST_IP' > ./.ipconfigtmp;
echo "HOST_IP=$hostIp" >> ./.ipconfigtmp;
cat ./.ipconfigtmp > ./.env
rm ./.ipconfigtmp