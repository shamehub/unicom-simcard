#!/bin/bash
pw="tlxd-hadoop(2015)!@#"
command1="ssh root@115.231.105.20"
backup="scp -r root@115.231.105.20:/var/www/api-test/php/logs/* ./logs"
copy1="scp -r ./web root@115.231.105.20:/var/www/api-test"
copy2="scp -r ./php root@115.231.105.20:/var/www/api-test"

/usr/bin/expect <<-EOF
    spawn $backup;
    expect {
        "*password:" {send "$pw\r"; }
        "*(yes/no)?" {send "yes\r"; }
    }
    set timeout -1
    expect "*$"
    spawn $command1;
    expect {
        "*password:" {send "$pw\r"; }
        "*(yes/no)?" {send "yes\r"; }
    }
    expect "*#"
    send "rm -rf /var/www/api-test\r"
    set timeout -1
    expect "*#"
    send "mkdir -p /var/www/api-test\r"
    set timeout -1
    expect "*#"
    send "exit\r"
    expect "*$"
    spawn $copy1;
    expect {
        "*password:" {send "$pw\r"; }
        "*(yes/no)?" {send "yes\r"; }
    }
    set timeout -1
    expect "*$"
    spawn $copy2;
    expect {
        "*password:" {send "$pw\r"; }
        "*(yes/no)?" {send "yes\r"; }
    }
    set timeout -1
    expect "*$"
    spawn $command1;
    expect {
        "*password:" {send "$pw\r"; }
        "*(yes/no)?" {send "yes\r"; }
    }
    expect "*#"
    send "chmod -R 0777 /var/www/api-test/php/logs\r"
    set timeout -1
    expect "*#"
    send "exit\r"
    expect "*$"
expect eof
EOF
