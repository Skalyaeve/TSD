hostIp=$(ip addr | grep 'inet 10.' | cut -d' ' -f6 | cut -d'/' -f1)
cat ./.env | grep -v 'HOST_IP' > ./.ipconfigtmp;
echo "HOST_IP=$hostIp" >> ./.ipconfigtmp;
cat ./.ipconfigtmp > ./.env
rm ./.ipconfigtmp