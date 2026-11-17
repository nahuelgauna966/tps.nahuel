# Cuestionario Práctico: Máquinas Virtuales, Docker y GitHub Actions

**Alumno:** ____________________________________  
**Fecha:** _____________________________________

---

## Máquinas virtuales

### 1. ¿Qué es una máquina virtual y para qué se utiliza?
Una máquina virtual (VM) es un sistema informático simulado por software que funciona como una computadora independiente. Puede ejecutar su propio sistema operativo y programas. Se utiliza para probar sistemas, ejecutar aplicaciones en entornos aislados, usar distintos sistemas operativos en un mismo equipo y aprovechar mejor el hardware.

### 2. Nombrá dos diferencias entre una máquina virtual y una computadora física.
- Una computadora física tiene componentes de hardware propios; una VM utiliza recursos virtualizados del equipo anfitrión.
- Se pueden crear, copiar o eliminar VMs mediante software con facilidad; una computadora física requiere cambios o reemplazos de hardware para modificar sus recursos.

### 3. ¿Qué función cumple un hipervisor?
El hipervisor crea y administra máquinas virtuales. Distribuye entre ellas recursos del equipo físico, como CPU, memoria y almacenamiento, y las mantiene aisladas unas de otras.

### 4. Mencioná dos programas que permitan crear máquinas virtuales.
Oracle VirtualBox y VMware Workstation.

### 5. ¿Qué significa asignar 4 GB de RAM a una máquina virtual?
Significa configurar la VM para que pueda utilizar hasta 4 GB de memoria RAM del equipo anfitrión. Esos recursos deben estar disponibles en el equipo físico; reservar demasiada memoria puede afectar al anfitrión y a otras VMs.

### 6. ¿Qué es una imagen ISO y para qué sirve?
Es un archivo que contiene una copia del contenido de un disco óptico, como un DVD de instalación. Se puede usar como medio virtual para instalar un sistema operativo en una VM.

### 7. ¿Para qué se utiliza SSH al conectarse a una máquina virtual Linux?
SSH permite conectarse y administrar la VM de forma remota desde una terminal mediante una conexión cifrada, por ejemplo, para ejecutar comandos o transferir archivos de forma segura.

### 8. Escribí el comando para conectarte por SSH al usuario `admin` en la IP `192.168.1.50`.
```bash
ssh admin@192.168.1.50
```

### 9. ¿Qué significa que una máquina virtual sea efímera?
Que está pensada para usarse temporalmente y luego eliminarse o recrearse. Sus cambios pueden perderse al terminarla, por eso los datos que deban conservarse se guardan fuera de la VM o en almacenamiento persistente.

### 10. ¿Qué ventaja tiene usar snapshots en una VM?
Un snapshot guarda el estado de la VM en un momento determinado. Permite volver a ese estado si una actualización, configuración o prueba causa problemas. No reemplaza una copia de seguridad independiente.

---

## Docker

### 11. ¿Cuál es la diferencia entre imagen Docker y contenedor Docker?
Una imagen es una plantilla inmutable con los archivos y la configuración necesarios para crear un contenedor. Un contenedor es una instancia ejecutable de esa imagen, aislada del resto del sistema.

### 12. ¿Qué comando muestra los contenedores en ejecución?
```bash
docker ps
```

### 13. ¿Qué comando muestra todos los contenedores, incluso detenidos?
```bash
docker ps -a
```

### 14. ¿Qué comando se usa para descargar una imagen de Ubuntu?
```bash
docker pull ubuntu
```

### 15. ¿Qué comando crea y ejecuta un contenedor Ubuntu interactivo?
```bash
docker run -it --name ubuntu-interactivo ubuntu
```
Las opciones `-i` y `-t` mantienen la entrada interactiva y asignan una terminal. En algunas imágenes mínimas puede ser necesario indicar un programa, por ejemplo `bash`.

### 16. ¿Qué significa mapear el puerto `8080:80`?
En `-p 8080:80`, el puerto `8080` del equipo anfitrión se conecta con el puerto `80` del contenedor. Así se puede acceder desde el anfitrión al servicio que escucha en el puerto 80 del contenedor usando el puerto 8080.

### 17. Nombrá tres estados posibles de un contenedor Docker.
Creado (`created`), en ejecución (`running`) y detenido (`exited`).

### 18. ¿Qué comando detiene un contenedor llamado `webapp`?
```bash
docker stop webapp
```

### 19. ¿Qué comando elimina un contenedor llamado `mysql-db`?
```bash
docker rm mysql-db
```
El contenedor debe estar detenido. Si está en ejecución, primero se detiene con `docker stop mysql-db`.

### 20. Escribí un ejemplo simple de `docker run` con nginx exponiendo puerto 8080.
```bash
docker run -d --name web-nginx -p 8080:80 nginx
```
Luego se puede acceder al servidor desde el anfitrión en `http://localhost:8080`.

---

## GitHub Actions

### 21. ¿Qué es GitHub Actions?
Es una plataforma de automatización integrada en GitHub. Permite ejecutar tareas como pruebas, compilaciones y despliegues en respuesta a eventos del repositorio.

### 22. ¿Para qué sirve un archivo YAML en GitHub Actions?
Se utiliza para describir un workflow: sus eventos de activación, trabajos, pasos y acciones. GitHub interpreta esos archivos para ejecutar la automatización.

### 23. ¿En qué carpeta se guardan los workflows?
En `.github/workflows/`, dentro del repositorio. Cada workflow se define en un archivo `.yml` o `.yaml`.

### 24. ¿Qué evento ejecuta un workflow cuando se hace push al repositorio?
El evento `push`. Se configura bajo `on`, por ejemplo: `on: push`.

### 25. ¿Qué hace la action `actions/checkout`?
Descarga o hace checkout del contenido del repositorio en el entorno de ejecución, para que los pasos siguientes puedan acceder a sus archivos.

### 26. ¿Qué hace la action `actions/setup-node`?
Configura una versión de Node.js en el runner para que los pasos del workflow puedan ejecutar comandos como `npm install` y `npm test`.

### 27. ¿Para qué sirve automatizar tests en CI/CD?
Permite ejecutar pruebas de manera consistente ante cambios. Ayuda a detectar errores temprano y evita integrar o desplegar cambios que no superan las verificaciones definidas.

### 28. Escribí una estructura mínima de workflow con `push`.
```yaml
name: Verificar cambios

on: push

jobs:
  verificar:
    runs-on: ubuntu-latest
    steps:
      - name: Obtener el código
        uses: actions/checkout@v4
```

### 29. ¿Qué ventaja tienen las runners efímeras?
Cada trabajo se ejecuta en un entorno temporal que se descarta al terminar. Esto reduce la contaminación entre ejecuciones y hace que los trabajos comiencen desde un entorno limpio.

### 30. ¿Qué pasaría si falla un test en el pipeline?
El paso de pruebas y normalmente el trabajo o workflow quedan marcados como fallidos. Se puede revisar el log para corregir el problema; los pasos posteriores dependientes de ese trabajo no se ejecutan, salvo que se haya configurado lo contrario.

---

## Práctica

### 31. Escribí el comando para crear una carpeta llamada `proyecto_vm`.
```bash
mkdir proyecto_vm
```

### 32. Escribí el comando Linux para entrar en esa carpeta.
```bash
cd proyecto_vm
```

### 33. Escribí el comando para crear un archivo llamado `app.js`.
```bash
touch app.js
```

### 34. Escribí un Dockerfile mínimo usando Node.js.
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
CMD ["node", "app.js"]
```
Este ejemplo supone que `app.js` está en el directorio desde donde se construye la imagen. Se puede construir con `docker build -t mi-app .` y ejecutar con `docker run --rm mi-app`.

### 35. Escribí un workflow de GitHub Actions que ejecute `npm install` y `npm test`.
```yaml
name: Tests de Node.js

on: push

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Obtener el código
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Instalar dependencias
        run: npm install

      - name: Ejecutar tests
        run: npm test
```
El repositorio debe incluir un `package.json` con un script llamado `test` para que ese último paso pueda ejecutarse correctamente.
