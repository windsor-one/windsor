<div align="center">
  <img src="assets/logo.png" alt="Windsor" width="112" />

  # Windsor

  ### Precisión aplicada para convertir ideas en proyectos.

  **Español · English · ENGLISH**

  **Estrategia · Diseño · Tecnología · Innovación**

  <p>
    Windsor evalúa ideas, construye marcas y desarrolla productos
    digitales con método, investigación y sensibilidad estética. La experiencia
    integra español e inglés con una jerarquía de contenido 60/25/15.
  </p>

  <p>
    <a href="https://github.com/windsor-one/windsor">Repositorio</a>
    ·
    <a href="index.html">Explorar el sitio</a>
    ·
    <a href="contacto.html">Contacto</a>
  </p>
</div>

---

## La idea detrás del proyecto

Una buena idea necesita algo más que entusiasmo: necesita dirección. Windsor trabaja en el espacio entre la posibilidad y la ejecución para convertir una intuición, una necesidad o una oportunidad en una solución clara y viable.

Este repositorio contiene el sitio web principal de Windsor y sus experiencias editoriales, programas, recursos y proyectos relacionados. La propuesta combina una identidad visual editorial con interacciones ligeras y una estructura de navegación pensada para acompañar al visitante desde el descubrimiento hasta el contacto.

## Qué encontrarás aquí

| Área | Descripción | Entrada principal |
| --- | --- | --- |
| **Inicio** | Presentación de Windsor, servicios, método y principios de trabajo. | [`index.html`](index.html) |
| **Metodología** | El proceso de Windsor: entender, definir, construir y refinar. | [`metodologia.html`](metodologia.html) |
| **Proyectos** | Casos, iniciativas y trabajos seleccionados. | [`proyectos.html`](proyectos.html) |
| **CIDE** | Centro de Innovación y Desarrollo Empresarial. | [`cide.html`](cide.html) |
| **Windsor One** | Espacio dedicado a la propuesta Windsor One. | [`windsor-one.html`](windsor-one.html) |
| **BeQueer** | Proyecto editorial y de comunidad. | [`BeQueer.html`](BeQueer.html) |
| **Programas** | Becas, oportunidades y desarrollo profesional. | [`becas.html`](becas.html) · [`careers.html`](careers.html) |
| **Recursos** | Orientación vocacional, recomendaciones e inspiración. | [`orientacion-vocacional.html`](orientacion-vocacional.html) |

## Servicios

Windsor no parte de una solución predeterminada. Cada proyecto recibe una combinación distinta de estrategia, diseño y tecnología según su contexto y sus objetivos.

- **Evaluación de proyectos:** análisis de ideas, mercado, competencia, oportunidades y riesgos.
- **Arquitectura de marca:** naming, identidad visual, posicionamiento y personalidad.
- **Auditorías digitales:** revisión de redes sociales, sitios web, plataformas y experiencia de usuario.
- **Desarrollo digital:** sitios web y aplicaciones personalizadas con supervisión humana en cada decisión relevante.

## Método

> **Entender → Definir → Construir → Refinar**

Primero investigamos el contexto, el problema, el mercado y las personas involucradas. Después convertimos la información en una dirección estratégica clara; construimos una solución específica para el proyecto; y finalmente revisamos, probamos y mejoramos antes de considerarla terminada.

## Stack y enfoque técnico

El sitio está construido como una experiencia web estática, sin una cadena de compilación obligatoria. Esto permite editar el contenido con rapidez, mantener una estructura fácil de inspeccionar y publicar los cambios directamente desde el repositorio.

| Capa | Implementación |
| --- | --- |
| **Estructura** | HTML semántico en páginas independientes. |
| **Presentación** | CSS centralizado en [`styles.css`](styles.css). |
| **Interacción** | JavaScript nativo en [`script.js`](script.js). |
| **Recursos** | Imágenes, iconos y video en [`assets/`](assets/) y [`Recursos/`](Recursos/). |
| **Tipografía** | Montserrat y Open Sans, cargadas desde Google Fonts. |

## Ejecutar el sitio localmente

No necesitas instalar dependencias para revisar el sitio. Solo necesitas Python 3, Node.js con un servidor estático o cualquier servidor HTTP equivalente.

```bash
git clone https://github.com/windsor-one/windsor.git
cd windsor
python3 -m http.server 8000
```

Después abre [`http://localhost:8000`](http://localhost:8000) en tu navegador. Servir el proyecto mediante HTTP —en lugar de abrir directamente `index.html`— permite probar correctamente las rutas, los recursos y el comportamiento del sitio en un entorno local.

## Estructura del repositorio

```text
.
├── assets/                  # Imágenes, favicon y recursos visuales
├── Recursos/                # Recursos multimedia adicionales
├── index.html               # Página de inicio
├── styles.css               # Sistema visual y responsive layout
├── script.js                # Navegación e interacciones
├── metodologia.html         # Método Windsor
├── proyectos.html           # Proyectos y casos
├── cide.html                # Centro de Innovación y Desarrollo Empresarial
├── becas.html               # Programa BK2
├── careers.html             # Oportunidades profesionales
└── contacto.html            # Formulario y canales de contacto
```

## Principios de diseño

La experiencia visual se apoya en cuatro principios: **método** para tomar mejores decisiones, **artesanía** para evitar soluciones genéricas, **sensibilidad** para unir estrategia y estética, e **IA + criterio** para usar nuevas herramientas sin sustituir el juicio humano.

## Contribuir

Las mejoras de contenido, accesibilidad, rendimiento y experiencia responsive son bienvenidas. Para proponer un cambio, crea una rama descriptiva, verifica las páginas afectadas en escritorio y móvil, y abre un pull request con una explicación breve del problema, la solución y cualquier captura relevante.

```bash
git checkout -b mejora/nombre-del-cambio
# realiza tus cambios
git diff --check
git add .
git commit -m "Mejora la experiencia de ..."
git push -u origin mejora/nombre-del-cambio
```

Antes de abrir el pull request, comprueba especialmente que los enlaces relativos funcionen, que las imágenes tengan texto alternativo y que la experiencia siga siendo usable con `prefers-reduced-motion` activado.

## Contacto

Si quieres conversar sobre una idea, una marca o un producto digital, visita [`contacto.html`](contacto.html) y escríbenos.

<div align="center">
  <br />
  <strong>Idea → Estrategia → Proyecto</strong>
  <br />
  <sub>Windsor · Latinoamérica</sub>
</div>
