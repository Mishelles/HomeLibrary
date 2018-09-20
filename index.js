let express = require("express");
let server = express();
// Указание статической папки public
server.use('/public', express.static('public'));
/* Подключение обработчика шаблонов pug, шаблоны - в папке views
*/
server.set("view engine", "pug");
server.set("views", `./views`);
/* Отображение страницы с шаблоном mypage.pug из папки views */
server.get("/", (req, res) => {
    res.render("mypage", {
        value: 1 /* Значение value=1 передаётся в шаблон */
    });
});
server.listen(3000);