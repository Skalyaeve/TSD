if [ -e '/proc/sys/fs/binfmt_misc/WSLInterlop' ]; then
	hostIp=$(ip addr | grep 'inet.*eth0' | cut -d' ' -f6 | cut -d'/' -f1)
	echo "On WSL"
else
	hostIp=$(ip addr | grep 'inet 10.' | cut -d' ' -f6 | cut -d'/' -f1)
	echo "Not on WSL"
fi
cat ./.env | grep -v 'HOST_IP' > ./.ipconfigtmp1;
echo "HOST_IP=$hostIp" >> ./.ipconfigtmp1;
cat ./.ipconfigtmp1 | grep -v 'FortyTwoCallBackURL' > ./.ipconfigtmp2;
echo "FortyTwoCallBackURL='http://$hostIp:3000/auth/42/callback'" >> ./.ipconfigtmp2;
cat ./.ipconfigtmp2 | grep -v 'GoogleCallBackURL' > ./.ipconfigtmp3;
echo "GoogleCallBackURL='http://$hostIp:3000/auth/google/redirect'" >> ./.ipconfigtmp3;
cat ./.ipconfigtmp3 > ./.env;
rm ./.ipconfigtmp1 ./.ipconfigtmp2 ./.ipconfigtmp3