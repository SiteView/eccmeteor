

cd addonsv;pwd;cmake .;cd ..;
cd node-v0.10.24;pwd;./configure;cd ..;

make -C addonsv;
make -C node-v0.10.24;

cp ./node-v0.10.24/out/Release/node ./bin

