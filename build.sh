#!/bin/bash
set -e

# sourc directory of this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SRC=$DIR/src

# Make sure src exists
mkdir -p $SRC

# change dir
cd $DIR/deps/mozjpeg

# download and setup requiered program
sudo apt-get -y install build-essential cmake libtool autoconf automake m4 nasm pkg-config libpng-dev
sudo ldconfig /usr/lib

# autoreconf
autoreconf -fiv

# start configuring
emconfigure ./configure --without-simd --without-turbojpeg CFLAGS="-O3"

# Make it.
emmake make clean
emmake make -j4

cd $DIR/deps/mozjpeg/.libs

# If we can not find that file... Something must be wrong.
cp cjpeg cjpeg.bc
cp djpeg djpeg.bc
cp jpegtran jpegtran.bc

# Compite to javascript!
emcc -03 cjpeg.bc -s LEGACY_VM_SUPPORT=1 -s "EXPORTED_RUNTIME_METHODS=[]" -s ELIMINATE_DUPLICATE_FUNCTIONS=1 -s ALLOW_MEMORY_GROWTH=1 --memory-init-file 0 --pre-js ../../../cjpeg_pre.js --post-js ../../../cjpeg_post.js -L"$DIR/deps/mozjpeg/.libs" -ljpeg -o cjpeg.js
emcc -03 djpeg.bc -s LEGACY_VM_SUPPORT=1 -s "EXPORTED_RUNTIME_METHODS=[]" -s ELIMINATE_DUPLICATE_FUNCTIONS=1 -s ALLOW_MEMORY_GROWTH=1 --memory-init-file 0 --pre-js ../../../djpeg_pre.js --post-js ../../../djpeg_post.js -L"$DIR/deps/mozjpeg/.libs" -ljpeg -o djpeg.js
emcc -03 jpegtran.bc -s LEGACY_VM_SUPPORT=1 -s "EXPORTED_RUNTIME_METHODS=[]" -s ELIMINATE_DUPLICATE_FUNCTIONS=1 -s ALLOW_MEMORY_GROWTH=1 --memory-init-file 0 --pre-js ../../../jpegtran_pre.js --post-js ../../../jpegtran_post.js -L"$DIR/deps/mozjpeg/.libs" -ljpeg -o jpegtran.js

# move to src.
mv cjpeg.js $SRC/cjpeg.js
mv djpeg.js $SRC/djpeg.js
mv jpegtran.js $SRC/jpegtran.js

echo "Successfully compiled mozjpeg to javascript! Try to check $SRC"