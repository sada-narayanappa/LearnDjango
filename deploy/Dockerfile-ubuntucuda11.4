# Specify the parent image from which we build
FROM stereolabs/zed:3.7-gl-devel-cuda11.4-ubuntu20.04

# Set the working directory
WORKDIR /app

# Copy files from your host to your current working directory
COPY cpp hello_zed_src

# Build the application with cmake
RUN mkdir /app/hello_zed_src/build && cd /app/hello_zed_src/build && \
    cmake -DCMAKE_LIBRARY_PATH=/usr/local/cuda/lib64/stubs \
      -DCMAKE_CXX_FLAGS="-Wl,--allow-shlib-undefined" .. && \
    make

# Run the application
CMD ["/app/hello_zed_src/build/ZED_Tutorial_1"]