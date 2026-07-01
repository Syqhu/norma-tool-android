# norma tool Android

Zenless Zone Zero 向け育成プランナー「norma tool」の Android beta 版です。

PC版から、キャラ一覧、育成方針、目標ステータス比較、ディスク管理、デイリー管理をスマホ向けに移植しています。

## Status

beta 版です。まずはローカル保存で使える範囲を優先しています。

未対応:

- 画像 OCR
- HoYoLAB ログイン / 同期
- ビルドカード画像保存

## Build

```bash
npm install
npm run android:build:debug
```

生成された APK:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

詳しくは [ANDROID.md](ANDROID.md) を見てください。
