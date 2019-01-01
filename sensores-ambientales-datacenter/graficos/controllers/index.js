module.exports = {
	index: function (req, res) {
		res.render("index", {
			title: "Gráficas en tiempo real."
		});
	}
}