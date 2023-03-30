const configMail = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "daniferri.tcc@gmail.com",
        pass: "yotvpzycnofplgio"
    },
    default: {
        from: "no-reply <noreply@daniferritcc@gmail.com>"
    }
};

module.exports = configMail;