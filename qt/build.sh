

cd libutil;pwd;cmake .;cd ..;
cd ccgnu2;pwd;./configure;cd ..;
cd addon;pwd;cmake .;cd ..;

make -C libutil;
make -C ccgnu2;
make -C addon;

cp ./addon/libaddon.a ./bin
cp ./libutil/libutil.a ./bin
cp ./ccgnu2/src/.libs/libccgnu2.a ./bin
