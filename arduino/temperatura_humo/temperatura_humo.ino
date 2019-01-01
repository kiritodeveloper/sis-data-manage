#include "dht22.h"
#include "mqt22.h"
#include <dht.h>
#include <UIPEthernet.h>
#include <PubSubClient.h>  

#define ledPin 1
#define intervalo 1500 // Temporizador usado para tomar los datos y enviarlos al servidor
#define intervalo2 2000 // Tiempo de Muestreo de Datos
#define intervalo_lectura 1000 //Periodo en el que se toman las muestras
#define numero_lecturas 10 //Numero de Lecturas
#define sub_intervalo intervalo_lectura/numero_lecturas 
#define numero_sensores 6 //Numero de sensores

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
dht220 s3(3, 4, 'A', 'C', 2, 'F', 'D' , 38);
dht220 s4(4, 5, 'A', 'C', 3, 'F', 'D' , 5);
dht220 s5(5, 6, 'A', 'C', 3, 'F', 'D' , 21);
dht220 s6(6, 7, 'A', 'C', 3, 'F', 'D' , 38);
//dht220 s7(7, 8, 'B', 'C', 2, 'F', 'D' , 80);
//dht220 s8(8, 9, 'B', 'C', 2, 'F', 'D' , 90);

mqt220 s7(7, A0, 'A', 'C', 1);
mqt220 s8(8, A1, 'A', 'C', 2);
mqt220 s9(9, A2, 'A', 'C', 3);
mqt220 s10(10, A3, 'B', 'C', 4);
mqt220 s11(11, A4, 'B', 'C', 5);
mqt220 s12(12, A5, 'B', 'C', 6);

//dht220 s9(17, 11);

char envoi[5];
char resultat2[6];
char topico_ID[34];
char topicos[40];
char payload[30];


char Lecturas[numero_lecturas];
int lectura_anterior[numero_sensores + 1];

//byte mi_ip[] = {192,168,1,55};
byte mac[] = { 0x74,0x69,0x69,0x2D,0x30,0x31 };
byte servidor[] = { 192, 168, 1, 129 };


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
  
/*  
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
*/
  IPAddress myIP(192,168,1,121);
  Ethernet.begin(mac,myIP);
  
  client.connect(ARDU);
  Actualizacion();
  contador = millis();
}

void loop() {

  //client.loop();
       
  enviar(s1);
  cuanto_tardo();
  retardo(intervalo);
  /*
  enviar(s2);
  cuanto_tardo();
  retardo(intervalo);
   enviar(s3);
  cuanto_tardo();
  retardo(intervalo);
  enviar(s4);
  cuanto_tardo();
  retardo(intervalo);
  enviar(s5);
  cuanto_tardo();
  retardo(intervalo);
  enviar(s6);
  cuanto_tardo();
  enviar2(s7);
  cuanto_tardo();
  enviar2(s8);
  cuanto_tardo();
  enviar2(s9);
  cuanto_tardo();
  enviar2(s10);
  cuanto_tardo();
  enviar2(s11);
  cuanto_tardo();
  enviar2(s12);
  cuanto_tardo();
  
  retardo(intervalo);
  cuanto_tardo();
  */  
}

void Actualizacion(){

  Serial.println("Generando Valores Iniciales");
    
  actualizar(s7);
  actualizar(s8);
  actualizar(s9);
  actualizar(s10);
  actualizar(s11);
  actualizar(s12);
  
}

void actualizar(mqt220 q){

  lectura_anterior[q.obtenerId()] = obtener_lectura(q.obtenerPin(), sub_intervalo, numero_lecturas);  
  
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

void enviar2(mqt220 s) {

  generar_idsensor_2(s.obtenerId(), s.obtenerSala(), s.obtenerBloquex(), s.obtenerBloquey());
  subirDato_2(s.obtenerId(), obtener_dato(s.obtenerId(), s.obtenerPin()), topico_ID);  
      
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

void subirDato_2(uint8_t id, float dato, char idsensor[]) {
  
  generar_topico_2(topico_ID);
  generar_dato(dato);
  
  Serial.println("Dato:");
  Serial.println(resultat2);
   
  if (client.connected()) {
      
    //Serial.println("Publicando...");
    client.publish(topicos, resultat2);
    Serial.println("Publicado");
      
  }else{
      
    Serial.println("Reconnectando...");
    client.connect(ARDU);
    
  }
    
}


//Funcion para generar el CharArray del ID del Sensor
void generar_idsensor(uint8_t id, char sala, char bloque_x, uint8_t bloque_y, char frontal, char lateral, uint8_t rack){
  
  char acumulador[5];
  
  strcpy(topico_ID,"");
  strcat(topico_ID,"DHT22_");
  acumulador[0] = sala;
  acumulador[1] = bloque_x;
  acumulador[2] = '\0';
  strcat(topico_ID,acumulador);
  strcpy(acumulador,"");
  itoa(bloque_y, acumulador, 10);
  if(bloque_y<10){
    strcat(topico_ID,"0");
  }
  strcat(topico_ID,acumulador);
  strcpy(acumulador,"");
  strcat(topico_ID,"_");
  acumulador[0] = frontal;
  acumulador[1] = lateral;
  acumulador[2] = '\0';
  strcat(topico_ID,acumulador);
  strcpy(acumulador,"");
  itoa(rack, acumulador, 10);
  if(rack<10){
    strcat(topico_ID,"0");
  }
  
  strcat(topico_ID,acumulador);
  strcpy(acumulador,"");
  Serial.println(topico_ID);
    
}


//Topico para Humo
void generar_idsensor_2(uint8_t id, char sala, char bloque_x, uint8_t bloque_y){
  
  char acumulador[5];
  
  strcpy(topico_ID,"");
  strcat(topico_ID,"MQT2_");
  acumulador[0] = sala;
  acumulador[1] = bloque_x;
  acumulador[2] = '\0';
  strcat(topico_ID,acumulador);
  strcpy(acumulador,"");
  itoa(bloque_y, acumulador, 10);
  if(bloque_y<10){
    strcat(topico_ID,"0");
  }
  strcat(topico_ID,acumulador);
  strcpy(acumulador,"");
  strcat(topico_ID,"_");
  itoa(id, acumulador, 10);
  if(id<10){
    strcat(topico_ID,"0");
  }
  strcat(topico_ID,acumulador);
  strcpy(acumulador,"");
  Serial.println(topico_ID);
    
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

void generar_topico_2(char idsensor2[]){  

  strcpy(topicos,"");
  strcat(topicos,"sensores/");
  strcat(topicos,idsensor2);
  strcat(topicos,"/humo");
  Serial.println(topicos);
  
}

//Funcion para pasar el Dato a CharArray
void generar_dato(float datos){
  
  dtostrf(datos, 2, 1, envoi);
  String resultat(envoi);
  resultat.toCharArray(resultat2,6);
  
}

float obtener_dato(uint8_t id_sensor, uint8_t pinadc){
  
  int lecturita = lectura_anterior[id_sensor];
  Serial.print("Lectura Anterior:");
  Serial.println(lecturita);
    
  int lectura_actual = obtener_lectura(pinadc, sub_intervalo, numero_lecturas);
  float valor_porcentaje = comparar_lectura(lectura_actual, lecturita);
  lectura_anterior[id_sensor] = lectura_actual;
  
  Serial.print("Lectura Actual:");
  Serial.println(lectura_actual);
  
  //Serial.print("Valor Porcentaje:");
  //Serial.println(valor_porcentaje);
  
  return valor_porcentaje;
  
}

uint8_t obtener_lectura(uint8_t puerto_analogo, uint8_t subintervalo, uint8_t lecturas){
  
  long total = 0;  
  for(int i=0; i<lecturas; i++){
    
    total = total + analogRead(puerto_analogo);
    retardo(subintervalo);
  
  }
  
  long promedio = total/lecturas;
  uint8_t valor = map(promedio, 0, 1023, 0, 100);
  
  return valor;
  
}

float comparar_lectura(uint8_t lectura_nueva, uint8_t lectura_antigua){
  
  int diferencia = lectura_antigua - lectura_nueva;
  diferencia = abs(diferencia);
  float porcentaje = (float)diferencia/lectura_antigua;
  porcentaje = porcentaje * 100;
  return porcentaje;
  
}
