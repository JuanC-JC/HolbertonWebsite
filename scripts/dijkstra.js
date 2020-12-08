var canvas = document.getElementById("lienzo");
var lienzo = canvas.getContext("2d");

canvas.addEventListener("click",canvasClick);

window.addEventListener("resize",changeProportion);

// rellenar los muros sin tener que dar click, si no que sea sostenido
var button_initial = document.getElementById("nodo-initial");
var button_finish = document.getElementById("nodo-finish");
var button_wall = document.getElementById("nodo-wall");
var button_start = document.getElementById("start");


button_initial.addEventListener("click",set_initial);
button_finish.addEventListener("click",set_finish);
button_wall.addEventListener("click",set_wall);
button_start.addEventListener("click",start_algorithm);


var buttons=[button_initial,button_finish,button_wall,button_start];

var button_selected= NaN;

var width = canvas.width;
var height = canvas.height;
var proporcion=25;

//cuando carga el script por primera vez
if(screen.width<800){
    alert("pequeño");
    proporcion = 50;
}
else{
    varproporcion = 25;
}


var table = new Grid(height/proporcion,width/proporcion);
var path = new pathfinder(table);

var color_initial = "#1BC986"
var color_finish = "#DF6060"
var color_wall = "#003549"
var color_path = "#FFB747";


var pathVisitedInOrder = [];

var betterPath = [];

//variable de control para cuando renderiza los caminos
var rendering = false;

//renderiza la patanlla por primera vez
renderCanvas(width,height);

//renderiza cuando cambia el tamaño de la pagina
function changeProportion(){

    if(screen.width<800){
        proporcion = 50;
    }
    else{
        proporcion = 25;
    }

    renderCanvas(width,height);
    
}

function select(button){

    for(idx=0;idx<buttons.length;idx++){

        if(button !== buttons[idx]){
            buttons[idx].style.padding= "0rem";
        }

    }

    button.style.padding ="0.5rem";

    button_selected = button;

}

function set_initial(){
    select(button_initial);

}

function set_finish(){
    select(button_finish);
}

function set_wall(){
    select(button_wall);
}

function start_algorithm(){


    //ejecuta el algoritmo
    var paths = path.dijkstra()

    if(paths.length==0){
        rendering = false;
        return
    }
    else{
        
        //si se esta renderizando retorna
        if(rendering==true){
            return
        }

        //obtengo los caminos 
        betterPath = paths[0]
        pathVisitedInOrder = paths[1]
        
        //cambia la variable que se esta renderizando
        rendering = true;

        //renderiza todo en limpio
        renderCanvas(width,height);

        //renderizo la busqueda
        renderVisitedInOrder()



    }



}

function renderCanvas(ancho,alto){

    // fondo del lienzo
    lienzo.fillStyle = "white";
    lienzo.fillRect(0,0,ancho,alto);


    //nodo inicial
    drawRect(table.init.col,table.init.row,color_initial);

    //nodo final
    drawRect(table.finish.col,table.finish.row,color_finish);


    //todos los bloques
    for(idx in table.walls){
        
        drawRect(table.walls[idx].col,table.walls[idx].row,color_wall);

    }   

    for(i=0;i<=alto/proporcion;i++){

        drawLine("#A8D7FC",i*proporcion,0,i*proporcion,alto);
    }


    for(i=0;i<=ancho/proporcion;i++){

        drawLine("#A8D7FC",0,i*proporcion,ancho,i*proporcion);
        
    }

}

function renderVisitedInOrder(){

    var fx = setInterval(function()
    {
        var bk = pathVisitedInOrder.shift();

        //nodo inicial
        drawRect(table.init.col,table.init.row,color_initial);

        //nodo final
        drawRect(table.finish.col,table.finish.row,color_finish);

        //dibuja el nodo cortado de los visitados en orden       
        drawRect(bk.col,bk.row,"#40D0E7");

        //dibuja las lineas
        for(i=1;i<=height/proporcion;i++){

            drawLine("#A8D7FC",i*proporcion,0,i*proporcion,height);
        }
    
        for(i=1;i<=width/proporcion;i++){
    
            drawLine("#A8D7FC",0,i*proporcion,width,i*proporcion);
            
        }

        //cuando ya no quedan mas elementos por visitar dibuja todo el camino y finaliza
        if(pathVisitedInOrder.length == 0 ){
            
            for(idx in betterPath){
                drawRect(betterPath[idx].col,betterPath[idx].row,color_path);
            }

            //nodo inicial
            drawRect(table.init.col,table.init.row,color_initial);

            //nodo final
            drawRect(table.finish.col,table.finish.row,color_finish);

            rendering = false;
            clearInterval(fx)
        }

    },15);
}

function canvasClick(evento){


    if(rendering==true){
        return
    }


    var rect = canvas.getBoundingClientRect();

    //proporcion cuanto tenia el canvas vs cuanto tiene ahora;

    var scalex = canvas.width/rect.width;
    var scaley = canvas.height/rect.height;

    //resto los margenes superior y lateral izquierdo y multiplico por lo que debe aumentar el pixel
    var x = (evento.clientX - rect.left) * scalex;
    var y = (evento.clientY - rect.top) * scaley;


    const posx = Math.trunc(x/ proporcion);
    const posy = Math.trunc(y/ proporcion);


    var newNode = table.matriz[posy][posx];

    var change_init_finish = false;

    //si tiene seleccionado muro y el nodo no es el final ni el inicial
    if(button_selected== button_wall && (newNode !== table.init && newNode !== table.finish)){

        console.log("valido para cambio")

        change_init_finish = false;

        //sacar ese nodo de los muros si era muro
        if(newNode.isWall){
            //ya no puede ser un muro
            newNode.isWall = false;

            //elimino ese nodo en especifico de la lista de muros
            table.walls.splice(table.walls.indexOf(newNode),1);
        }

        //si no era muro agregarlo
        else{
            newNode.isWall = true;

            table.walls.push(newNode);
        }
    }


    //tengo seleccionado el boton inicial
    if(button_selected == button_initial){

        change_init_finish = true;

        if(newNode !== table.finish){
            table.init = newNode;
        }

    }

    //tengo seleccionado el boton final
    if(button_selected == button_finish){

        change_init_finish = true;

        if(newNode !== table.init){
            table.finish = newNode;
        }

    }

    //para sacar muros solo si fue cambio de inicio o fin
    if(change_init_finish){
        //sacar ese nodo de los muros si era muro
        if(newNode.isWall){
            //ya no puede ser un muro
            newNode.isWall = false;

            //elimino ese nodo en especifico de la lista de muros
            table.walls.splice(table.walls.indexOf(newNode),1);
        }
    }

    renderCanvas(width,height);


}

function drawLine(color,x,y,x2,y2){
    lienzo.beginPath();
    lienzo.lineWidth=2;
    lienzo.strokeStyle = color;
    lienzo.moveTo(x,y);
    lienzo.lineTo(x2,y2);
    lienzo.stroke();
    lienzo.closePath();
}

function drawRect(x,y,color){
    lienzo.fillStyle = color;

    lienzo.fillRect(x * proporcion +2,y * proporcion +2,proporcion-4,proporcion-4);
}
