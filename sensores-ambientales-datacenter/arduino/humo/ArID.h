#include <Arduino.h>

class Ardu {
    public:
        Ardu(char sala, char bloquex, uint8_t bloquey, uint8_t id);
        String obtenerId();
        
    private:
        char _sala;
        char _bloquex;
        uint8_t _bloquey;
        uint8_t _id;
        
        
};
