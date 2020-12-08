class queue{
    constructor(){
        this.items =[];
    }

    enqueque(item){
        this.items.push(item);
    }

    dequeque(){
        if(this.qsize() > 0){
            return this.items.shift();
        }
        
        return NaN
        
    }

    qsize(){
        return this.items.length;
    }
}


class Nodo{

    constructor(row,col){
        this.row = row;
        this.col = col;
        
        this.distance = 9999;
        this.visited = false;
        this.previousNode = NaN;
        this.isWall = false;

    }
}


class Grid{
    
    constructor(rows,cols){
        this.rows = rows;
        this.cols = cols;
        this.matriz = []

        var cols = []

        for(var i=0;i<this.rows;i++){

            for(var w=0;w<this.cols;w++){

                cols.push(new Nodo(i,w));

            }

            this.matriz.push(cols);

            cols = [];

        }

        this.walls = []

        this.init = this.matriz[1][1];
        this.finish = this.matriz[4][4];


    }

    copy(){

        var matrizCopy = [];

        var cols = []

        for(var i=0;i<this.rows;i++){

            for(var w=0;w<this.cols;w++){

                var nodito = new Nodo(i,w);
                nodito.distance = this.matriz[i][w].distance;
                nodito.visited = this.matriz[i][w].visited;
                nodito.previousNode = this.matriz[i][w].previousNode;
                nodito.isWall = this.matriz[i][w].isWall;

                cols.push(nodito);

            }

            matrizCopy.push(cols);

            cols = [];

        }

        return matrizCopy;


    }
}


class pathfinder{

    constructor(grid){
        this.grid = grid;
    }

    dijkstra(){

        this.matriz = this.grid.copy();
        this.initNode = this.matriz[this.grid.init.row][this.grid.init.col];
        this.finishNode = this.matriz[this.grid.finish.row][this.grid.finish.col];

        /*Nodos visitados en orden */
        this.visitedInOrder = []

        this.betterPath = []

        this.unvisitedNodes = new queue();
        
        var buff = this.finishNode;

        var i = 0;

        if(this.travelgrid()){
            
            while(buff !== this.initNode){


                this.betterPath.push(buff);

                buff = buff.previousNode;

            }

            this.betterPath.push(this.initNode);

            return([this.betterPath,this.visitedInOrder])
        }
        else{
            return([]);
        }

    }

    /*recorrer todo los nodos para encontrar una ruta */
    travelgrid(){

        this.initNode.distance = 0;
        this.unvisitedNodes.enqueque(this.initNode);
        var i = 0;

        // /* itero cada elemento en la cola de orden para visitar */
        while(this.unvisitedNodes.qsize()>0){

            i+=1;

            // obtiene el primer elemento de la cola de nodos por visitar
            var node = this.unvisitedNodes.dequeque();


            // si el nodo mas cercano tiene distancia infinita debemos detener el algoritmo tambien, estamos atrapados
            if(node.distance == 9999){
                return false
            }
            
            node.visited = true;
            
            // agrego cada nodo que he visitado a la lista, para hacer el render
            this.visitedInOrder.push(node)

            // // si el nodo es el nodo.final detener el algoritmo
            if (node == this.finishNode){
                return true
            }


            // // #actualizar los nodos sin visitar
            this.updateUnvisitedNeighbors(node);

            
        }


    }

    updateUnvisitedNeighbors(node){

        // #obtener primero los nodos sin visitar
        var unvisitedNeighbors = this.getUnvisitedNeighbors(node)

        // iterar la lista de elementos no visitados
        for(var idx in unvisitedNeighbors){

            var neigh = unvisitedNeighbors[idx]
            
            // agregar la distancia que tiene cada nodo desde su predecesor 
            neigh.distance = node.distance+1;
            neigh.previousNode = node;
            
            //si el nodo no se encuentra en la lista de los que vamos a visitar 
            if(this.unvisitedNodes.items.indexOf(neigh) < 0 ){
                
                // si el nodo no es un muro o el nodo final, guardarlo en la lista para visitar
                if(neigh.isWall == false){
                    this.unvisitedNodes.enqueque(neigh);
                }
                    
            }

        }

    }

    getUnvisitedNeighbors(node){

        var neighbors = []
        var real = []

        // nodo superior
        if(node.row >0){
            neighbors.push(this.matriz[node.row-1][node.col]);
        } 
        
        // nodo derecho
        if(node.col < (this.matriz[0].length -1) ){
            neighbors.push(this.matriz[node.row][node.col+1]);
        } 

        // nodo inferior
        if(node.row < (this.matriz.length -1 ) ){
            neighbors.push(this.matriz[node.row+1][node.col]);
        } 

        // nodo izquierdo
        if(node.col >0  ){
            neighbors.push(this.matriz[node.row][node.col-1]);
        } 

        // devuelve una lista solo con los nodos que no han sido visitados
        for(idx in neighbors){


            if(neighbors[idx].visited == false){
                
                real.push(neighbors[idx]);

            }
        }
        return real;
    
    }

}
