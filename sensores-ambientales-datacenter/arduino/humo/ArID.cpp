#include "ArID.h"

Ardu::Ardu(char sala, char bloquex, uint8_t bloquey, uint8_t id){
    
    _sala = sala;
    _bloquex = bloquex;
    _bloquey = bloquey;
    _id = id;
    
}

String Ardu::obtenerId() {
	String topico_arduino;
        char topico_ardu[15];
	topico_arduino = topico_arduino + "ARD_";
	topico_arduino = topico_arduino + _sala;
	topico_arduino = topico_arduino + _bloquex;
	topico_arduino = topico_arduino + String(_bloquey);
	topico_arduino = topico_arduino + "_";
	topico_arduino = topico_arduino + String(_id);
        //topico_arduino.toCharArray(topico_ardu,15);
    return topico_arduino;
}



