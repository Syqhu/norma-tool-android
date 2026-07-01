# norma tool Android

Zenless Zone Zero 向け育成プランナー「norma tool」の Android beta 版です。

PC版から、キャラ一覧、育成方針、目標ステータス比較、ディスク管理、デイリー管理をスマホ向けに移植しています。

## v0.1.1

- ディスク倉庫の並び替え
- 倉庫ディスクを比較候補へ反映
- 起動時ローカル自動バックアップ
- 最新バックアップからの復元
- GitHub更新表示の改善

## v0.1.2

- Android内HoYoLABログイン画面
- HoYoLAB Cookie自動取得
- 所持キャラ/ステータス/ディスク同期
- Androidローカル通知対応

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
