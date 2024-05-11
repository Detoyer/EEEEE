window,addEventListener("DOMContentLoaded", start);

function start() {
	alert("Joy and Sadness are competing against each other to turn Riley's memory orbs into their respective emotion and colours. Choose your side and help them now.")
}

class Connect4{
	constructor(selector){
		this.rows = 6;
		this.cols = 7;
		this.player = "Joy";
		this.selector = selector;
		this.isGameOver = false;
		this.onPlayerMove = function(){};
		this.createGrid();
		this.setupEventListeners();
	}
	createGrid(){
		const $board = $(this.selector)
		$board.empty();
		this.isGameOver = false;
		this.player = "Joy";
		for (let row = 0; row < this.rows; row++){
			const $row = $("<div>").addClass("row");
			for (let col = 0; col < this.cols; col++){
				const $col = $("<div>")
					.addClass("col empty")
					.attr("data-col", col)
					.attr("data-row", row);
				$row.append($col);
			}
			$board.append($row)
		}
	}
	setupEventListeners(){
		const $board = $(this.selector);
		const that = this;
		function findLastEmptyCell(col){
			const cells = $(`.col[data-col='${col}']`)
			for (let i = cells.length - 1; i >= 0; i--){
				const $cell = $(cells[i]);
				if ($cell.hasClass("empty")){
					return $cell;
				}
			}
			return null;
		}
		$board.on("mouseenter", ".col.empty", function (){
			if (that.isGameOver) return;
			const col =$(this).data("col");
			const $lastEmptyCell = findLastEmptyCell(col);
			$lastEmptyCell.addClass(`next-${that.player}`);
		});
		$board.on("mouseleave", ".col", function(){
			$(".col").removeClass(`next-${that.player}`);
		});
		$board.on("click", ".col.empty", function(){
			console.log(that.player);
			if (that.isGameOver) return;
			const col = $(this).data("col");
			const $lastEmptyCell = findLastEmptyCell(col);
			$lastEmptyCell.removeClass(`empty next-${that.player}`);
			$lastEmptyCell.addClass(that.player);
			$lastEmptyCell.data("player", that.player);
			const winner = that.checkForWinner(
				$lastEmptyCell.data("row"),
				$lastEmptyCell.data("col")
			)
			if (winner){
				that.isGameOver = true;
				alert(`Game over! ${that.player} has won this round!`);
				$(".col.empty").removeClass("empty");
				return;
			}
			that.player = (that.player === "Joy") ? "Sadness" : "Joy";
			that.onPlayerMove();
			console.log(that.player);
			$(this).trigger("mouseenter");
		});
	}
	checkForWinner(row, col){
		const that = this;

		function $getCell(i, j){
			return $(`.col[data-row="${i}"][data-col="${j}"]`);
		}
		function checkDirection(direction){
			let total = 0;
			let i = row + direction.i;
			let j = col + direction.j;
			let $next = $getCell(i, j);
			console.log("checking ", direction, " Next is ", $next.data("player"))
			while (i >= 0 &&
				i < that.rows &&
				j >= 0 &&
				j < that.cols &&
				$next.data("player") === that.player
			){
				console.log("checking ", direction, " Next is ", $next.data("player"))
				total++;
				i += direction.i;
				j += direction.j;
				$next = $getCell(i, j);
			}
			return total;
		}
		function checkWin(directionA, directionB){
			const total = 1 +
				checkDirection(directionA) +
				checkDirection(directionB);
			console.log(total)
			if (total >= 4){
				return that.player;
			} else{
				return null;
			}
		}
		function checkDiagonalBLtoTR(){
			return checkWin({i: 1, j: -1}, {i: 1, j: 1});
		}
		function checkDiagonalTLtoBR(){
			return checkWin({i: 1, j: 1}, {i: -1, j: -1});
		}
		function checkVerticals(){
			return checkWin({i: -1, j: 0}, {i: 1, j: 0});
		}
		function checkHorizontals(){
			return checkWin({i: 0, j: -1}, {i: 0, j:1});
		}
		return checkVerticals() ||
			checkHorizontals() ||
			checkDiagonalBLtoTR() ||
			checkDiagonalTLtoBR();
	}
	restart(){
		this.createGrid();
		this.onPlayerMove();
	}
}


$(document).ready(function(){
	const connect4 = new Connect4("#connect4")

	connect4.onPlayerMove = function(){
		$("#player").text(connect4.player);
	} 

	$("#restart").click(function(){
		connect4.restart();
	})
})