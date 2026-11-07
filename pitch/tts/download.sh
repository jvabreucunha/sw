#!/bin/sh
# Baixa o Piper (TTS offline) e as vozes masculinas pt-BR usadas na narração.
set -e
cd "$(dirname "$0")"
curl -sL https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_linux_x86_64.tar.gz | tar xz
for v in faber cadu jeff; do
  base=https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/$v/medium/pt_BR-$v-medium
  curl -sL -o pt_BR-$v-medium.onnx $base.onnx
  curl -sL -o pt_BR-$v-medium.onnx.json $base.onnx.json
done
