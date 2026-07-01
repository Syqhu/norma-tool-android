# Android beta

norma tool の Android 版です。Capacitor で PC 版の画面とローカル保存機能を先に移植しています。

## できること

- キャラ一覧、育成方針、目標ステータス比較
- 手入力による現在ステータス / ディスク管理
- ディスク倉庫、比較、交換候補
- 育成素材プランナー、キャラタグ、デイリー管理
- ローカル自動バックアップと復元

## まだ未対応

- 画像 OCR
- HoYoLAB ログイン / 同期
- ビルドカード画像保存

## 開発コマンド

```bash
npm install
npm run android:sync
npm run android:build:debug
```

APK は次に出力されます。

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Windows では Android SDK と JDK 21 が必要です。
