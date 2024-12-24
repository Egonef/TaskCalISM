# TaskCalISM


## Instalaciones necesarias

Primero comprobamos que no haya librerias nuevas que instalar tanto en
backend como en el frontend:

```bash
npm install
```

Después hay que tener instalado el ngrok, que esta en snap o siguiendo las
 instrucciones en su página web (Solo es descomprimir un archivo y pegar un comando).

Ahora abrimos el ngrok en el puerto en el que tengamos el backend, en nuestro caso el 3000:

 ```bash
ngrok http 3000
```

La primera vez que lo ejecuteis os dirá que no teneis una clave. Meteros en la internete buscais ngrok y en su pagina inicias con github o con google si no os quereis parar. 

Una vez iniciados os llevará a la página de inicio y si bajais hacia abajo llegais a un texto que dice: "Run the following command to add your authtoken to the default ngrok.yml configuration file."

Pues copiad el comando de debajo y pegarlo en una terminal para configurarlo con vuestra clave automaticamente, y ahora ya podeis iniciar el negrok como he indicado antes. 

## Iniciar el chiringuito

Encendemos el ngrok y nos vamos a la carpeta del backend y encendemos nodemon:

 ```bash
npx nodemon
```

Para el frontend necesitamos copiar la dirección generada por ngrok (La primera dirección que hay donde dice forwarding en la terminal donde hayais iniciado el ngrok, desde http hasta app).

Ahora nos vamos a la carpeta del frontend y duplicamos el archivo modelo.env (Aseguraos de dejarlo a la misma altura que el de modelo, no lo metais en ninguna carpeta más), y lo renombramos para que su nombre sea ".env".

Ahora en el campo de BACKEND_IP sustituimos por la direccion que teniamos en nuestro ngrok.

Y finalmente ahora si, nos vamos a la carpeta del frontend y lo iniciamos con:


 ```bash
npx expo start --tunnel --clear
```

La parte del clear es para que borre la cache por que a veces no te reconoce cuando cambias la direccion del ngrok(Cada vez que inicias el ngrok hay que cambiarla asi que tener cuidao de no estar apagando el ngrok, el cakcend podeis apagarlo cuando querais eso no pasa nada)

Por cierto si os toca las narices cuando vayais a encender el frontend con que no os detecta el ngrok poned:

 ```bash
npm install expo-ngrok
```
