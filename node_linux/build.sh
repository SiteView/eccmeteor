

cd libutil;pwd;cmake .;cd ..;
cd ccgnu2;pwd;./configure;cd ..;
cd addon;pwd;cmake .;cd ..;
cd db;pwd;cmake .;cd ..;
cd sv_addon;pwd;cmake .;cd ..;
cd node-v0.8.22;pwd;./configure;cd ..;

make -C libutil;
make -C ccgnu2;
make -C addon;
make -C db;
make -C sv_addon;
make -C node-v0.8.22;

cp ./db/svdb ./meteor_runtime
cp ./node-v0.8.22/out/Release/node ./meteor_runtime
