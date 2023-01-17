PROTOC_GEN_TS_PATH="D:\DS\Assignment 1\DS2022_30443_Andreica_Paul_Assignment_1_Frontend\node_modules\.bin\protoc-gen-ts.cmd"
PROTOC_OUT_DIR="./proto/generated"
mkdir -p ${PROTOC_OUT_DIR}
protoc \
       --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
       --js_out="import_style=commonjs,binary:${PROTOC_OUT_DIR}" \
       --ts_out="service=grpc-web:${PROTOC_OUT_DIR}" \
       proto/chat.proto
