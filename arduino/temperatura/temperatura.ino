#include "dht22.h"
#include <dht.h>
#include <UIPEthernet.h>
#include <PubSubClient.h>  

#define ledPin 1
#define intervalo 1500 // Temporizador usado para tomar los datos y enviarlos al servidor

#define MARGEN_ENVIO 13500
#define TIEMPO_VIVO 16000

//ID de la tarjeta Arduino
char ARDU[] = "ARD_AC02_01";

//Usuario y Password
//char usuario[] = "mosquito";
//char password[] = "0000";

//ID de cada sensor de temperatura
dht220 s1(1, 2, 'A', 'C', 2, 'F', 'D' , 5);
dht220 s2(2, 3, 'A', 'C', 2, 'F', 'D' , 21);
dht220 s3(3, 4, 'A', 'C', 3, 'F', 'D' , 5);
dht220 s4(4, 5, 'A', 'C', 3, 'F', 'D' , 21);
dht220 s5(5, 6, 'A', 'C', 2, 'F', 'D' , 60);
dht220 s6(6, 7, 'A', 'C', 2, 'F', 'D' , 70);
dht220 s7(7, 8, 'B', 'C', 2, 'F', 'D' , 80);
dht220 s8(8, 9, 'B', 'C', 2, 'F', 'D' , 90);
//dht220 s9(17, 11);

char envoi[5];
char resultat2[6];
char topicos[40];
char payload[30];
char topico_ID[30];

//byte mi_ip[] = {192,168,1,55};
byte mac[] = { 0x74,0x69,0x69,0x2D,0x30,0x31 };
byte servidor[] = { 192, 168, 1, 118 };


void callback(char* topic, byte* payload, unsigned int length) {
  if (length>0) {
    // Retorno del payload, sin uso...
  }
}

EthernetClient ethClient;
PubSubClient client(servidor, 1883, callback, ethClient);

long contador = 0;

void setup() {
  
  Serial.begin(9600);
  
  
  //  initialize ethernet controller by DHCP
  Serial.println("Conectando...");
  if(Ethernet.begin(mac) == 0) {
    // something went wrong
    while(true)
    { 
      for (int i=0;i<3;i++){
        if (digitalRead(ledPin) == LOW) digitalWrite(ledPin, HIGH);
        else digitalWrite(ledPin, LOW);
      };
      delay(300);
    }
  } 
  else {
    IPAddress myip = Ethernet.localIP();
  };
  
  client.connect(ARDU);
  
  contador = millis();
}

void loop() {

  //client.loop();
       
  enviar(s1);
  cuanto_tardo();
  retardo(intervalo);
  enviar(s2);
  cuanto_tardo();
  retardo(intervalo);
  enviar(s3);
  cuanto_tardo();
  retardo(intervalo);
  enviar(s4);
  cuanto_tardo();
  retardo(intervalo);
  //enviar(s5);
  //cuanto_tardo();
  //enviar(s6);
  //cuanto_tardo();
  //enviar(s7);
  //cuanto_tardo();
  //enviar(s8);
  //cuanto_tardo();
  //enviar(s9);
  //cuanto_tardo();
  
  //retardo(intervalo);
  cuanto_tardo();
    
}

//Rutina para evitar desconexion del servidor 
void cuanto_tardo(){
  
  long tiempo = millis() - contador;
  if(tiempo > MARGEN_ENVIO){
    while(millis() - contador < TIEMPO_VIVO){
      client.loop();
    }
    contador = millis();
    Serial.println("Esperando PING");
  }
  
}

//Rutina de retardo
void retardo(long tiempo){
  
  long ahora = millis();
  long terminar = ahora + tiempo;
  
  while(millis()< terminar){
    client.loop();//No hacer nada hasta completar el tiempo
  }
  
}

//Funcion enviar dato
void enviar(dht220 s) {

  generar_idsensor(s.obtenerId(), s.obtenerSala(), s.obtenerBloquex(), s.obtenerBloquey(), s.obtenerFrontal(), s.obtenerLateral(), s.obtenerRack());
  subirDato(s.obtenerId(), 'T', s.obtenerTemperatura(), topico_ID);
  subirDato(s.obtenerId(), 'H', s.obtenerHumedad(), topico_ID);
  
}

//Funcion de Envio del Dato
void subirDato(uint8_t id, char tipo, float dato, char idsensor[]) {
  
  generar_topico(topico_ID, tipo);
  generar_dato(dato);
  
  //Serial.print("Dato:");
  Serial.println(resultat2);
  
  client.loop();
  
  if (client.connected()) {
      
    //Serial.println("Publicando...");
    client.publish(topicos, resultat2);
    Serial.println("Publicado");
      
  }else{
      
    Serial.println("Reconnectando...");
    client.connect(ARDU);
    //client.connect("arduino", usuario, password);
  }
   
  
}

//Funcion para generar el CharArray del ID del Sensor
void generar_idsensor(uint8_t id, char sala, char bloque_x, uint8_t bloque_y, char frontal, char lateral, uint8_t rack){
  
  char acumulador[5];
  
  strcpy(topico_ID,"");
  strcat(topico_ID,"DHT22_");
  //idsensor = idsensor + sala;
  //idsensor = idsensor + bloque_x;
  //idsensor.toCharArray(acumulador,10);
  acumulador[0] = sala;
  acumulador[1] = bloque_x;
  acumulador[2] = '\0';
  strcat(topico_ID,acumulador);
  strcpy(acumulador,"");
  //idsensor = "";
  itoa(bloque_y, acumulador, 10);
  if(bloque_y<10){
    //idsensor = idsensor + String(0);
    //idsensor = idsensor + String(bloque_y);
    strcat(topico_ID,"0");
  }
  //else{
    //idsensor = idsensor + String(bloque_y);
    //idsensor = idsensor + '\0';
  //}
  //idsensor.toCharArray(acumulador,10);
  strcat(topico_ID,acumulador);
  strcpy(acumulador,"");
  strcat(topico_ID,"_");
  //idsensor = "";
  //idsensor = idsensor + frontal;
  //idsensor = idsensor + lateral;
  //idsensor.toCharArray(acumulador,10);
  acumulador[0] = frontal;
  acumulador[1] = lateral;
  acumulador[2] = '\0';
  strcat(topico_ID,acumulador);
  strcpy(acumulador,"");
  //idsensor = "";
  itoa(rack, acumulador, 10);
  if(rack<10){
    //idsensor = idsensor + String(0);
    //idsensor = idsensor + String(rack);
    strcat(topico_ID,"0");
  }
  //else{
    //idsensor = idsensor + String(rack);
    //dsensor = idsensor + '\0';
  //}
  strcat(topico_ID,acumulador);
  //idsensor.toCharArray(acumulador,10);
  //strcat(topico_ID,acumulador);
  strcpy(acumulador,"");
  Serial.println(topico_ID);
  //Borrar String
  //idsensor = "";
  
}

//Funcion para unir el topico
void generar_topico(char idsensor2[], char tipo_sensor){    
    
  if(tipo_sensor == 'T'){
    strcpy(topicos,"");
    strcat(topicos,"sensores/");
    strcat(topicos,idsensor2);
    strcat(topicos,"/temperatura");
    Serial.println(topicos);
  }
  
  else if(tipo_sensor == 'H'){
    strcpy(topicos,"");
    strcat(topicos,"sensores/");
    strcat(topicos,idsensor2);
    strcat(topicos,"/humedad");
    Serial.println(topicos);
    
  }  
  
  
}

//Funcion para pasar el Dato a CharArray
void generar_dato(float datos){
  
  dtostrf(datos, 2, 1, envoi);
  String resultat(envoi);
  resultat.toCharArray(resultat2,6);
  
}
