

cd libutil;pwd;cmake .;cd ..;
#cd ccgnu2;pwd;./configure;cd ..;
cd addon;pwd;cmake .;cd ..;
cd db;pwd;cmake .;cd ..;

make -C libutil;
#make -C ccgnu2;
make -C addon;
make -C db;

cp ./db/svdb ./bin
cp ./addon/libaddon.a ./bin
cp ./libutil/libutil.a ./bin
cp ./ccgnu2/src/.libs/libccgnu2.a ./bin
