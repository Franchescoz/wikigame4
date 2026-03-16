Pasos para instalarlo
1ªTener instalado el Node.js , en caso de o tenerlo desde aqui puedes descargarlo  https://nodejs.org/es .
  tambien comprobar que se ha instalando  ejecutando  los siguientes comandos 'node -v' y 'npm -v' desde la terminal (o PowerShell en Windows) 
  para comprobar que este instalando mostrando la version de estas.

2ªInstalar el IDE que se vaya a usar , recomendacion utilizar Visual Studio Code, aqui el link https://code.visualstudio.com/ .
  En VSCode instalar la extension "ES7+ React/Redux/React-Native snippets".

3ªInstalar Git , desde aqui https://git-scm.com/ y luego comprueba que esta instalado con este comando 'git --version' .
  Ahora configuraremos el usuario y correo electrónico con estos comandos:
  -'git config --global user.name "TuNombre"'
  -'git config --global user.email "tucorreo@ejemplo.com"'

4ª Para terminar tendremos que crear una cuenta de Github para subir los repositorios


Pasos para lanzar el proyecto
1ªAbrir la carpeta padre donde se encuentra las carpetas public ,README.md , etc ... .

2ªAbrimos el terminal del IDE ("Recordad que en esta terminal esteis dentro de la carpeta padre, en caso de que no usar 'cd' para meteron en esa carpeta ") y escribmos el siguiente comando 'npm install' , esperas que descargue y pones el siguiente comando 'npm run dev'

3ªListo si no ocurre algun error , se deberia haber encendido y ahora solo queda entrar en el localhost http://localhost:3000



WIKIGAME
Es una pagína tipo wikipedia pero enfocada a los videojuegos , donde vas a poder encontrar mucha informacion sobre estos , desde la historia del juego hasta incluso secretos.Basicamente vamos a tener para cada juego que añadamos una pagina con toda la informacion posible de este juego

Estilos usados:
Footer:
Tiene el texto centrado y fondo negro

Navbar:
La navbar tiene un título en el color lavanda, el buscador con el filtro con sus tonos lavanda y blanco y el icono del perfil a la derecha 

Landing:
Para los botones he utilizado dos estilos  uno con un color rosa lavanda y el otro fondo negro y borde del mismo color que e lotro , los textos y las fotos estan puesta con grid que en e lcaso de movil es una columna y varias filas y en el caso de pantalla mediana son dos filas y 8 columnasel fondo esta puesto con un bg-[url('/movil.png')] que se intercambia con la foto de la version de movil.En el carrousel está hecho de manera que si es la del centro pone unos casos y si es otro distinto muestra otro estilo para dar la sensacion de que pasas de una foto a otra usando ${isCenter ? "w-64 sm:w-96 h-48 sm:h-80 blur-0 scale-100" : "w-40 sm:w-64 h-32 sm:h-48 blur-sm opacity-50 scale-90"} , fuentes como montserra , medula one y Gill sans.

Iniciar sesion y Registrar:
Estos dos los pongo juntos porque son casi iguales la diferencia es la cantidad de inputs , pero en todo lo demás son iguales los botones los estilos que tiene cada uno , el footer con alguna información, un fondo de un color  que se llama Night y la imagen de background de fondo, para ordenarlo he utilizado el Flex , siendo una solo columna y los botones en fila.

listaTarjetajuegos:
Aquí para las tarjetas se han puesto foto arriba texto abajo y se ha hecho que en pantalla de pc tenga un grid con dos filas y cuatro columnas y en la versión de móvil de columnas y cuatro filas, los botones de paginación tiene un hover que pone el botón color lavanda , letra blanca y con flex para que aparezca en fila.

Crear Juego:
Esta vista también tiene el fondo de iniciar sesion y justo encima un  cuadro negro donde se encuentra todo el contenido , los botones siguen el mismo estilo salvo el de subir imagen que es un icono  y los otros dos cuando pasan al version de movil que pasa a ser iconos. En la versión de móvil todo está en una columna salvo los botones de cancelar , en la versión de pc debido a la posición en la que se encuentra el botón crear se ha tenido que meter todo el contenido del recuadro negro en el formulario y apartir de ahi dividirlo en dos columnas con flex , una para las fotos que tambien se han ordenado por flex y tres botones y otra para los inputs. Para terminar el borde de la descripción se ha puesto de bg-Lavanda.

Vistajuego y editar juego:
Estas dos vistas van junto en un solo componente  la de editar juego es exactamente igual que la de crear juego cambiando que los botones en vez de llevarte hacia la vista donde estan las tarjetas de los juegos guarda los cambios y vuelve a la vista juego, que como en las demás el modo admin sera el unico que pueda editar por lo que el botón desaparece en la vistajuego  de un usuario normal.La vista juego es como la anterior pero solo tiene un botón en forma de corazon para marcarlo de favorito arriba a la derecha y todo lo demás igual salvo que los campos tiene el fondo negro y todo colocado con flex dividido en dos columnas y en la de movil todo en una columna.


Perfil y editarPerfil:
Estos dos también están en un solo componente , para empezar tuve que cambiar la forma en se muestra las imágenes de los favoritos porque por alguna razón daba problema con los tamaños y no aparecían entonces me he visto obligado a cambiarlo para que se muestran,como en los demás lo he separados en dos columnas con flex , aunque con los favoritos he tenido que meter favoritos y las imágenes en un grid de una columna y después un flex para las imágenes, con los botones he tenido que crea botones parte como por ejemplo de banear hay dos uno con texto para la versión de PC que está debajo de lo que es la foto de perfil y el otro que es un icono que en la versión del móvil aparecerá arriba  y estos botones aparecerán cuando una cuenta admin esté sobre un perfil de un  usuario , mismo pasa con los botones de cancelar y volver que he tenido que hacer dos botones para el caso de movil y otro para el caso de pantallas más grandes, en la versión de movil las dos estan hechas en una columna con flex, lso demas son los mismo estilos ,fondo y recuadro negro como los demas .
 

Este proyecto esa formado por un lado la base de datos que contiene estas 4 tablas(juego, usuario, favorito y image_juego ) , mas una que es la auth.user que la tuve que usar ya para arreglar unos problemas con algunas funcionalidades, cada tabla guarda la informacion que requiere en la de los juego, la de juego y usuario, la de los usuarios, en favoritos se guarda la id del usuario y del juego que se ha marcado favorito y en la de image_juego se guarda la ide del juego y la imagen que va a pertencer a ese juego y por ultimo de la base de datos , esas imagenes se guardan en el storage/file/buckets que es parte de supabase y desde ahi se cogen la s imagenes.

Despues tenemos la api que en este proyecto tenemos varios routes, aunque hay una en especifico  que es el de sesion. Los routes son dos para juegos donde se hacen el get , put y post en uno y en el otro se hace el get por id para la vistajuego y por el otro lado igual pero para los usuarios un route para get, delete, put y post y el otro para el usuario individual. Tambien tenemos un route para la a tabla image_juego que hace un put para guardar las imagenes y otro put para favoritos para modificar el que este o no en favoritos, ademas de un delete para borrarlo de favoritos

Por ultimo en el frotend estan las funciones usadas para consumir las api por ejemplo en listajuego esta las funciones que usan los get de juegos y usuario en vistajuego esta el get por id de juegos y el put para modificar los datos e imagenes del juego, en perfil lo mismo con usuario y despues tenemos el registrar que es el post de los usuarios y la vista crear juego que es para el post de crear las vista juegos que todos estos datos obviamente se añaden o modifican en la base de datos.

Descripción de endpoints creados:
Como ya se ha dicho tenemos los get que recogen todos los datos de juego y usuario para mostrarlos en listatarjetasjuegos,ademas que el get de juego tiene la particularidad que para poder mostrar la imagen tambien tiene añadido el campo imagen_url de la tabla image_juego.

Estan los get por id para mostrar un unico juego en la vista juego o usuario en el perfil que aqui pasa lo mismo que en el anterior para jeugo tiene un campo añadidod para mostrar las imagenes del juego

Ahora vamos por partes porque tenemos el put de juego que modifica sus campos(titulo,consoslas,tipo_juego,descripcion) pero las imagenes no va por el mismo lado porque para las imagenes se ha tenido que crear un route que hace put a la tabla image_juego para subir las imagenes. En la vista perfil tenemos el put para modificar los datos del usuario ademas del delete para la tabla favoritos y eliminar juegos de favoritos, ademas del delete para banear usuairos(que todavia no esta puesto los roles).

tambien estan los post de usuarios en registrar para crear usuario y el post de crear juego



Variables de entorno:
En caso de no tener el archivo .env.local 
Crear el archivo manualmente con ese nombre (.env.local.) y añadir dentro estas variables de entornos
NEXT_PUBLIC_SUPABASE_URL=https://eerrowbyeaxocafugiqp.supabase.co//->para evitar que se metan
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_oENKkZLxvX1nOx7nI4d4KQ_jamo-U8O//->para evitar que se metan



Instrucciones de ejecución:
Primero ejecutamos el proyecto que tenemos que tener descargado previamente, con el comando npm run dev, y nos metemos a la url

Aparecemos en el landing donde hay dos opciones o vas a registrarte o iniciar sesión, Dependiendo de en cual te hayas mentido , rellenas los datos y te registras o rellenas los inicio de sesión una vez hecho esto te llevará al home o lista de tarjetas de juegos. Puedes por un lado meterte a tu perfil, editarlo o meterte algún juego y editarlo también.

Por último tienes la opción de darle al botón de un cuadrado mas que te llevara a la vista de crear juego donde píldoras crear un juego, también está la posibilidad de meterte al perfil de otra persona y banearlo pero para ello necesitaras saber su id.

La base de datos se compone de cuatro tablas que son juego, usuario, favorito y image_juego 
usuario: Tiene la información del usuario como  nombre, contraseña,email,descripción,imagen Perfil,admin(Booleano) y fecha de registro.
Tiene relación con la tabla favoritos donde está como foránea su id y con la tabla auth.users que es propia de supabase.

juego: Tiene la información del juego como título , consolas(Text) y tipo_juego(text), descripción.
Tiene relación con la tabla favoritos donde está como foránea su id y con la tablaimage_juego donde también tiene como foránea su id

favoritos:Tiene los ids de juego y usuario

image_juego:Tiene el id de juego ,image_url e imagenPrincipal(Booleano)
La url que tiene es para recoger la imagen desde storage/files/buckets donde hay dos uno para las fotos de perfil y otro para las imágenes de los juegos.

