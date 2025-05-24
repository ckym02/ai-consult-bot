# Node.js公式イメージをベースに使用
FROM node:18

# 作業ディレクトリを作成
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存パッケージをインストール
RUN npm install

# ソースコードをコピー
COPY . .

# 開発用ポート開放
EXPOSE 5173

# Vite開発サーバーを起動
CMD ["npm", "run", "dev"]
