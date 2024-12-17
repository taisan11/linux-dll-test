const library = Deno.dlopen(`./AquesTalk/f1/AquesTalk.dll`,  {
  "AquesTalk_Synthe": { parameters: ["pointer", "i32", "pointer"], result: "pointer" },
  "AquesTalk_FreeWave": { parameters: ["pointer"], result: "void" },
} as const);

// テキストデータの準備
const text = new TextEncoder().encode("こんにちは、世界！");
const speed = 100;
const sizePtr = new Uint32Array(1);

// AquesTalk_Synthe関数の呼び出し
const textPtr = Deno.UnsafePointer.of(text);
const sizePtrPointer = Deno.UnsafePointer.of(sizePtr);
const wavPtr = library.symbols.AquesTalk_Synthe(textPtr, speed, sizePtrPointer);
const wavSize = sizePtr[0];

if (wavPtr === null) {
  console.error(`Error generating speech: ${wavSize}`);
  library.close();
  Deno.exit(1);
}

// 生成された音声データの処理（例: ファイルに書き込む）
const wavData = new Uint8Array(Deno.UnsafePointerView.getArrayBuffer(wavPtr, wavSize));
await Deno.writeFile("output.wav", wavData);

// メモリの解放
library.symbols.AquesTalk_FreeWave(wavPtr);

// DLLのアンロード
library.close();
