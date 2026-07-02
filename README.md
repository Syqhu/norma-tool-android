# norma tool Android

Zenless Zone Zero向け育成・日課管理ツール「norma tool」のAndroid beta版です。

PC版のキャラ管理、育成方針、目標ステータス比較、ディスク管理、日課管理、HoYoLAB連携をスマホ向けに調整しています。

## Download

GitHub Releasesから最新版のAPKをダウンロードしてインストールしてください。

現在はdebug APK配布のbeta版です。端末によってはインストール時に警告が表示される場合があります。

## Features

- ホーム画面
- キャラ一覧とキャラ詳細
- キャラごとの育成方針
- 目標ステータスと現在ステータスの比較
- ディスク入力、スコア計算、交換候補表示
- 所持ディスク倉庫
- 編成シミュレーター
- キャラ相性候補と編成メモ
- 育成優先度ダッシュボード
- 日課トラッカー
- 日課カードと週課トラッカー
- Androidローカル通知
- スタミナ表示、回復タイマー、しきい値通知
- HoYoLABログイン連携
- HoYoLABから所持キャラ、ステータス、ディスク、日課、活性を同期
- HoYoLABログイン画面のBack / Reload / Done操作
- GitHub Releasesのアップデート確認
- ローカルバックアップと復元

## HoYoLAB

アプリ内のHoYoLABログイン画面からCookieを取得して同期します。

Cookieやログイン情報を外部サーバーへ送信する機能はありません。同期データは端末内に保存されます。

## Status

beta版です。PC版より一部機能は簡略化されています。

今後の追加予定:

- 画面レイアウトの調整
- HoYoLAB同期レビューの改善
- 通知ウィジェット風UIの強化
- PC版とのデータ連携改善
- 育成ランキング

## Build

```bash
npm install
npm run android:build:debug
```

生成されるAPK:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

詳しくは [ANDROID.md](ANDROID.md) を見てください。

## Note

このアプリは個人制作の非公式ツールです。
Zenless Zone Zeroおよび関連サービスの公式アプリではありません。
