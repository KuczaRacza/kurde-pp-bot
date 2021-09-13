#!/bin/bash
cp ../website /home/www -Rf;
rm -rf /home/www/kurde-pp;
mv /home/www/website /home/www/kurde-pp;
chown www:www /home/www/kurde-pp -Rf;
chmod 770 /home/www/kurde-pp -R;
cp production_website.conf /etc/nginx/conf.d/kurde-pp.conf
cp kurde-pp-bot.service /etc/systemd/system/ 
echo 'synced';