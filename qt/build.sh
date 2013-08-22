
#cd ccgnu2;pwd;./configure;cd ..;
#make -C ccgnu2;
#cp ./ccgnu2/src/.libs/libccgnu2.a ./bin

cd libutil;pwd;cmake .;cd ..;
cd addon;pwd;cmake .;cd ..;
cd db;pwd;cmake .;cd ..;
cd schedule;pwd;cmake .;cd ..;
cd control;pwd;cmake .;cd ..;

make -C libutil;
make -C addon;
make -C db;
make -C schedule;
make -C control;

