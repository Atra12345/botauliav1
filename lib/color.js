const chalk = require('chalk')

const color = (text, color) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

const bgcolor = (text, bgcolor) => {
	return !bgcolor ? chalk.green(text) : chalk.bgKeyword(bgcolor)(text)
}

const AuliaLog = (text, color) => {
	return !color ? chalk.yellow('[AULIAxNIA] ') + chalk.green(text) : chalk.yellow('[AULIAxNIA] ') + chalk.keyword(color)(text)
}

module.exports = {
	color,
	bgcolor,
	AuliaLog
}
