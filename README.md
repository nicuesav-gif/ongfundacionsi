# Fundación Sí

Proyecto educativo no oficial del integrador **Visibilizar para Ayudar — 2026**. Integrantes pendientes.

Sitio informativo sobre Fundación Sí, sus proyectos de inclusión social y las formas de colaborar. La referencia de estructura es [Manos Abiertas Santa Fe](https://github.com/nicuesav-gif/manos-abiertas-santa-fe).

## Ejecutar y publicar

El proyecto usa HTML, CSS y JavaScript del navegador. Servilo desde la raíz:

```sh
python -m http.server 8000
```

Abrí http://localhost:8000/. Para publicar en GitHub Pages tras integrar el PR, elegí **Settings → Pages → Deploy from a branch → main → / (root)**. No hace falta compilar. Los recursos propios usan rutas relativas para funcionar también bajo `/ongfundacionsi/`.

## Formulario

El navegador valida los cuatro campos y prepara un borrador para `info@fundacionsi.org.ar`. La persona decide si abre el borrador y lo envía desde su aplicación de correo. El sitio no recibe, almacena ni envía los datos. Si el navegador no tiene una aplicación de correo configurada, el correo oficial se puede copiar desde la sección de contacto.

## Archivos y extensión

- `index.html` contiene las secciones, los enlaces institucionales y los créditos.
- `style.css` reúne los colores, los componentes y el diseño responsive.
- `script.js` inicializa por separado la navegación compacta y el formulario.
- `ia.js` clasifica donaciones desde una foto o la cámara y administra el resumen.
- `imagenes/` contiene las fotografías optimizadas y el ícono institucional.

## Identificador de donaciones

El [modelo de Teachable Machine](https://teachablemachine.withgoogle.com/models/Ltqgjmmjl/) reconoce ropa, alimentos no perecederos, insumos médicos y de higiene, y la clase «Nada». Se cargan TensorFlow.js, la biblioteca de imágenes y el modelo cuando la persona inicia una captura. Las fotos y la cámara se procesan en el navegador.

Con una confianza de al menos 80 % se puede sumar una categoría de donación a la lista. «Nada» no se agrega. La lista vive en la página, se puede vaciar y no se envía a Fundación Sí. La cámara requiere permiso y un contexto seguro como GitHub Pages o localhost.

## Referencias

| Tema | Fuente |
| --- | --- |
| Historia, misión y fecha de fundación | [Quiénes somos](https://fundacionsi.org.ar/quienes-somos/) y [10.º aniversario](https://fundacionsi.org.ar/cumplimos-10-anos-sumate-a-nuestra-celebracion/) |
| Manuel Lozano y su libro | [Manuel Lozano](https://fundacionsi.org.ar/manuel-lozano/) |
| Rodri y acompañamiento en Carranza | [El trabajo artesanal de muchas voluntades](https://fundacionsi.org.ar/el-trabajo-artesanal-de-muchas-voluntades/) |
| Luz Díaz | [Perfil profesional de Luz Díaz](https://ar.linkedin.com/in/luz-d%C3%ADaz-243951123) |
| Fernando Perazzo | [Entrevista de faceBuda a Fernando Perazzo](https://www.youtube.com/watch?v=VOPBbMQO-Es) |
| Programas de la fundación | [Proyectos](https://fundacionsi.org.ar/proyectos/), con enlaces a los programas en la tabla del sitio |
| Donaciones, voluntariado y aportes empresariales | [Cómo ayudar](https://fundacionsi.org.ar/comoayudar/), [Ser voluntario](https://fundacionsi.org.ar/ser-voluntario/), [Empresas](https://fundacionsi.org.ar/empresas/) y [Reportes](https://fundacionsi.org.ar/reporte/) |
| Sede Palermo y canales oficiales | [Encontranos](https://fundacionsi.org.ar/encontranos/) y [portada oficial](https://fundacionsi.org.ar/) |

### Imágenes

| Archivo | Publicación y original |
| --- | --- |
| `mision-solidaria.webp` | [Misión Solidaria 2026](https://fundacionsi.org.ar/lo-que-dejo-la-mision-2026/) · [foto original](https://fundacionsi.org.ar/wp-content/uploads/2026/10/DSC5666-scaled.jpg) |
| `recorridas-nocturnas.webp` | [Portada institucional, sección Qué hacemos](https://fundacionsi.org.ar/) · [foto original](https://fundacionsi.org.ar/wp-content/uploads/2017/12/proyecto-img-2.jpg) |
| `encuentro-carranza.webp` | [Entrevista publicada por Fundación Sí](https://fundacionsi.org.ar/el-trabajo-artesanal-de-muchas-voluntades/) · [foto original](https://fundacionsi.org.ar/wp-content/uploads/2024/06/WhatsApp-Image-2024-06-25-at-18.00.09.jpeg) |
| `marca.png` | [Ícono del sitio oficial](https://fundacionsi.org.ar/wp-content/themes/fundacionsi/favicon-152.png) |

Las fotos documentan actividades. La foto grupal de Carranza se acredita a la publicación que la acompaña, sin identificar individualmente a quienes aparecen.
