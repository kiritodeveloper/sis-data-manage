//#include <SPI.h>
//#include "string.h"
#include "mqt22.h"
//#include "ArID.h"
#include <dht.h>
#include <UIPEthernet.h>
#include <PubSubClient.h>  

//#define MQTT_KEEPALIVE 3000

#define ledPin 1
#define intervalo 5000 // Tiempo de Muestreo de Datos
#define intervalo_lectura 1000 //Periodo en el que se toman las muestras
#define numero_lecturas 10 //Numero de Lecturas
#define sub_intervalo intervalo_lectura/numero_lecturas 
#define numero_sensores 6 //Numero de sensores

#define MARGEN_ENVIO 13500
#define TIEMPO_VIVO 16000

//Ardu ARDU1('A', 'C', 2, 1);

char ARDU[] = "ARD_AC02_01";
char usuario[] = "ARD_AC02_02";
char password[] = "adsib";


mqt220 s1(1, A0, 'A', 'C', 1);
mqt220 s2(2, A1, 'A', 'C', 2);
mqt220 s3(3, A2, 'B', 'C', 3);
mqt220 s4(4, A3, 'B', 'C', 4);
mqt220 s5(5, A4, 'A', 'C', 5);
mqt220 s6(6, A5, 'B', 'C', 6);


char envoi[5];
char resultat2 [6];
char topico_ID[34];
char topicos[40];
char payload[30];
String idsensor;
char Lecturas[numero_lecturas];
int lectura_anterior[numero_sensores + 1];
byte mac[] = { 0x74,0x69,0x69,0x2D,0x30,0x32 };
byte servidor[] = { 192, 168, 1, 161 };

void callback(char* topic, byte* payload, unsigned int length) {
  if (length>0) {
    // Retorno del payload, sin uso...
    //Serial.println(payload);
  }
}

EthernetClient ethClient;
PubSubClient client(servidor, 1883, callback, ethClient);

long contador = 0;

void setup() {

  Serial.begin(9600);
  Serial.println("Conectando...");
  //  initialize ethernet controller by DHCP
  /*
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
  IPAddress myIP(192,168,1,224);
  Ethernet.begin(mac,myIP);


  client.connect(ARDU);
  
  Actualizacion();
  contador = millis();
}

void loop() {

  client.loop();
  
  enviar(s1);
  cuanto_tardo();
  enviar(s2);
  cuanto_tardo();
  enviar(s3);
  cuanto_tardo();
  enviar(s4);
  cuanto_tardo();
  enviar(s5);
  cuanto_tardo();
  enviar(s6);
  cuanto_tardo();
  
  //retardo(intervalo);
  cuanto_tardo();
  
}

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

void Actualizacion(){

  Serial.println("Generando Valores Iniciales");
    
  actualizar(s1);
  actualizar(s2);
  actualizar(s3);
  actualizar(s4);
  actualizar(s5);
  actualizar(s6);
  
}

void actualizar(mqt220 q){

  lectura_anterior[q.obtenerId()] = obtener_lectura(q.obtenerPin(), sub_intervalo, numero_lecturas);  
  
}

void retardo(long tiempo){
  
  long ahora = millis();
  long terminar = ahora + tiempo;
  
  while(millis()< terminar){
    client.loop();    //No hacer nada hasta completar el tiempo
  }
  
}

void enviar(mqt220 s) {

  generar_idsensor(s.obtenerId(), s.obtenerSala(), s.obtenerBloquex(), s.obtenerBloquey());
  subirDato(s.obtenerId(), obtener_dato(s.obtenerId(), s.obtenerPin()), topico_ID);  
      
}

void subirDato(uint8_t id, float dato, char idsensor[]) {
  
  generar_topico(topico_ID);
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

void generar_idsensor(uint8_t id, char sala, char bloque_x, uint8_t bloque_y){
  
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

void generar_topico(char idsensor2[]){
  
  strcpy(topicos,"");
  strcat(topicos,"sensores/");
  strcat(topicos,idsensor2);
  strcat(topicos,"/humo");
  //strcat(topicos,idsensor2);
  
  Serial.println(topicos);

}

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
