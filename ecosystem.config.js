module.exports = {
  deploy : {
    demo : {
      user : "macool",
      host : "demo.moviggo.noggalito.com",
      ref  : "origin/production",
      repo : "git@github.com:noggalito/porttare-frontend.git",
      path : "~/demo-porttare-frontend",
      "post-deploy" : "export PATH=~/.nvm/versions/v0.12.14/bin:~/.rbenv/shims:$PATH && npm install && pm2 start './node_modules/grunt-cli/bin/grunt compress' --no-autorestart --no-daemon --name build-demo-porttare-frontend"
    }
  }
}
