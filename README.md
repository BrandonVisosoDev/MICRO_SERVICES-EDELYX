# Proyecto Final — Sistema de Gestión de Empleados con Microservicios

## Documentación Final del Proyecto EDELYX

---

## Índice

1. [Descripción General](#1-descripción-general)
2. [Objetivo del Proyecto](#2-objetivo-del-proyecto)
3. [Contexto y Problema que Resuelve](#3-contexto-y-problema-que-resuelve)
4. [Arquitectura del Sistema](#4-arquitectura-del-sistema)
5. [Tecnologías y Dependencias](#5-tecnologías-y-dependencias)
6. [Modelo de Datos](#6-modelo-de-datos)
7. [Estructura del Proyecto](#7-estructura-del-proyecto)
8. [Backend — Microservicios](#8-backend--microservicios)
9. [Comunicación entre Microservicios](#9-comunicación-entre-microservicios)
10. [Configuración de Servicios](#10-configuración-de-servicios)
11. [Frontend — Angular](#11-frontend--angular)
12. [Funcionalidades Implementadas](#12-funcionalidades-implementadas)
13. [Flujo de Funcionamiento](#13-flujo-de-funcionamiento)
14. [Diseño de la Interfaz](#14-diseño-de-la-interfaz)
15. [Decisiones Técnicas Relevantes](#15-decisiones-técnicas-relevantes)
16. [Evolución de la Solución — Cambios Respecto a la Propuesta Inicial](#16-evolución-de-la-solución--cambios-respecto-a-la-propuesta-inicial)
17. [Bitácora de Problemas y Soluciones](#17-bitácora-de-problemas-y-soluciones)
18. [Pruebas](#18-pruebas)
19. [Instalación y Configuración](#19-instalación-y-configuración)
20. [Uso y Ejecución](#20-uso-y-ejecución)
21. [Limitaciones y Consideraciones](#21-limitaciones-y-consideraciones)
22. [Lecciones Aprendidas](#22-lecciones-aprendidas)
23. [Estado Final del Proyecto](#23-estado-final-del-proyecto)
24. [Conclusiones](#24-conclusiones)

---

## 1. Descripción General

**EDELYX** es un sistema de gestión de empleados corporativos construido sobre una arquitectura de microservicios. El sistema permite administrar tres entidades principales — Empleados, Departamentos y Títulos de Trabajo — a través de una interfaz web moderna con un backend distribuido.

Cada entidad se gestiona mediante un microservicio independiente con su propia base de datos PostgreSQL, orquestados a través de Netflix Eureka para descubrimiento de servicios y Spring Cloud Gateway como punto de entrada único. La interfaz de usuario está desarrollada en Angular 22 con un diseño oscuro minimalista.

---

## 2. Objetivo del Proyecto

Desarrollar un sistema completo de gestión de empleados utilizando una arquitectura de microservicios que demuestre:

- Separación de responsabilidades por dominio con servicios independientes.
- Descubrimiento y enrutamiento dinámico de servicios.
- Comunicación inter-servicio para validación de integridad referencial.
- Interfaz frontend desacoplada que consume la API REST a través del Gateway.
- Operaciones CRUD completas con validaciones de negocio y protección de datos relacionados.

---

## 3. Contexto y Problema que Resuelve

El proyecto partió desde cero — sin código preexistente — con el objetivo de construir un sistema que:

1. **Gestione empleados** con información personal, salarial y organizacional.
2. **Organice la estructura corporativa** mediante departamentos y títulos de trabajo.
3. **Garantice la integridad de datos** entre entidades que residen en bases de datos separadas, impidiendo la eliminación de registros que tienen relaciones activas con otros microservicios.
4. **Presente la información consolidada** de las tres entidades en tarjetas visuales que combinan datos de múltiples fuentes.

---

## 4. Arquitectura del Sistema

### Diagrama General

```
Cliente (Angular :4200)
          ↓
API Gateway (:8080)
          ↓
Eureka Server (:8761) ← registro y descubrimiento
          ↓
┌──────────────────┬───────────────────┬──────────────────┐
│  ms-employees    │  ms-departments   │  ms-jobtitles    │
│     :8081        │      :8082        │      :8083       │
│  DB: Employees   │ DB: Departments   │ DB: Job_titles   │
│  (PostgreSQL)    │   (PostgreSQL)    │   (PostgreSQL)   │
└──────────────────┴───────────────────┴──────────────────┘
         ↕ RestTemplate (comunicación directa inter-servicio)
```

### Capas de cada Microservicio

```
Controller  →  recibe petición HTTP, delega al Service, define códigos HTTP
Service     →  lógica de negocio, validaciones, comunicación inter-servicio
DAO         →  interfaz JpaRepository, acceso a base de datos
Entity      →  mapeo tabla ↔ clase Java (con Lombok)
DTO         →  Respuesta genérica (mensaje, éxito, objeto) y DTOs de agregación
```

### Principios Arquitectónicos

- **Autonomía de datos**: cada microservicio es dueño de su base de datos.
- **Integridad referencial distribuida**: la eliminación de registros se valida mediante comunicación inter-servicio vía `RestTemplate`.
- **Frontend desacoplado**: la comunicación entre el cliente y el backend es exclusivamente vía HTTP REST a través del Gateway.
- **Service Discovery**: los microservicios se registran automáticamente en Eureka y el Gateway enruta dinámicamente usando `lb://`.

---

## 5. Tecnologías y Dependencias

| Capa                        | Tecnología                                                    | Versión               |
| --------------------------- | ------------------------------------------------------------- | --------------------- |
| Backend                     | Java + Spring Boot                                            | 4.1.1                 |
| Service Discovery           | Netflix Eureka                                                | Spring Cloud 2025.1.2 |
| API Gateway                 | Spring Cloud Gateway (WebFlux)                                | Spring Cloud 2025.1.2 |
| ORM                         | Spring Data JPA / Hibernate                                   | incluido en Boot      |
| Comunicación inter-servicio | RestTemplate                                                  | incluido en Boot      |
| Base de datos               | PostgreSQL                                                    | local                 |
| Boilerplate Java            | Lombok (`@Data`, `@AllArgsConstructor`, `@NoArgsConstructor`) | incluido              |
| Documentación API           | SpringDoc OpenAPI (Swagger UI)                                | 3.1.0                 |
| Frontend                    | Angular (standalone components)                               | 22.1.x                |
| Alertas UI                  | ngx-sonner                                                    | 3.1.0                 |
| Reactive Extensions         | RxJS                                                          | 7.8.x                 |
| Build backend               | Maven                                                         | —                     |
| Build frontend              | Angular CLI / npm                                             | —                     |
| Testing backend             | Spring Boot Test + JPA Test                                   | incluido              |
| Testing frontend            | Vitest                                                        | 4.0.8                 |

---

## 6. Modelo de Datos

### Entidad Employee (`ms-employees` / DB `Employees` / Tabla `EMPLEADOS`)

| Campo        | Tipo Java  | Notas                                                                      |
| ------------ | ---------- | -------------------------------------------------------------------------- |
| employeeId   | Integer    | PK, **asignación manual** (sin `@GeneratedValue`)                          |
| firstName    | String     | Obligatorio                                                                |
| lastName     | String     | Obligatorio                                                                |
| email        | String     | —                                                                          |
| phoneNumber  | **String** | Tipo String, no Integer (números de 10+ dígitos superan el rango de `int`) |
| hireDate     | LocalDate  | —                                                                          |
| salary       | Double     | —                                                                          |
| departmentId | Integer    | FK lógica, sin relación JPA                                                |
| jobTitleId   | Integer    | FK lógica, sin relación JPA                                                |

### Entidad Department (`ms-departments` / DB `Departments` / Tabla `DEPARTAMENTOS`)

| Campo         | Tipo Java | Campo DB (real) | JSON (serialización)                   | Notas       |
| ------------- | --------- | --------------- | -------------------------------------- | ----------- |
| deparmentId   | Integer   | deparment_id    | `departmentId` (vía `@JsonProperty`)   | PK          |
| deparmentName | String    | deparment_name  | `departmentName` (vía `@JsonProperty`) | Obligatorio |

> **Nota técnica**: los campos internos de la entidad `DepartamentoEntity` contienen un typo heredado (`deparment` sin la segunda `t`). Para mantener compatibilidad con el frontend sin modificar la base de datos, se utilizaron anotaciones `@JsonProperty` que serializan los campos con la nomenclatura correcta (`departmentId`, `departmentName`).

### Entidad JobTitle (`ms-jobtitles` / DB `Job_titles` / Tabla `TITULOSTRABAJO`)

| Campo      | Tipo Java | Notas       |
| ---------- | --------- | ----------- |
| jobTitleId | Integer   | PK          |
| jobTitle   | String    | Obligatorio |

### Relaciones entre Entidades

**No existen relaciones JPA entre los tres microservicios.** Los campos `departmentId` y `jobTitleId` en `Employee` son simples campos `Integer` sin anotaciones `@ManyToOne` ni `@JoinColumn`. Esto es consecuencia directa de la arquitectura: JPA no puede establecer relaciones entre entidades que residen en conexiones de base de datos distintas.

La integridad referencial se garantiza mediante comunicación inter-servicio en el backend (RestTemplate) y la combinación de datos se realiza tanto en el backend (endpoint `/cards`) como en el frontend (`forkJoin`).

---

## 7. Estructura del Proyecto

```
PROYECTO/
│
├── eureka-server/
│   └── src/main/
│       ├── java/.../EurekaServerApplication.java        ← @EnableEurekaServer
│       └── resources/application.properties             ← puerto 8761
│
├── employees/
│   └── src/main/java/com/mx/employees/
│       ├── controller/EmployeeController.java           ← endpoints REST + exists-by
│       ├── service/
│       │   ├── MetodosEmployees.java                    ← interfaz
│       │   └── EmployeesImpl.java                       ← lógica + RestTemplate + /cards
│       ├── dao/EmployeeDao.java                         ← JpaRepository + queries derivadas
│       ├── entity/EmpleadoEntity.java                   ← @Entity + Lombok
│       ├── dto/
│       │   ├── Respuesta.java                           ← DTO genérico
│       │   └── EmployeeCardDto.java                     ← DTO de agregación (tarjetas)
│       └── EmployeesApplication.java                    ← @Bean RestTemplate
│
├── departments/
│   └── src/main/java/com/mx/departments/
│       ├── controller/DepartmentController.java         ← endpoints REST
│       ├── service/
│       │   ├── MetodosDepartments.java                  ← interfaz
│       │   └── DepartmentsImpl.java                     ← lógica + RestTemplate
│       ├── dao/DepartmentsDao.java                      ← JpaRepository
│       ├── entity/DepartamentoEntity.java               ← @Entity + @JsonProperty
│       ├── dto/Respuesta.java                           ← DTO genérico
│       └── DepartmentsApplication.java                  ← @Bean RestTemplate
│
├── jobTitles/
│   └── src/main/java/com/mx/jobTitles/
│       ├── controller/JobTitleController.java            ← endpoints REST
│       ├── service/
│       │   ├── MetodosJobTitles.java                    ← interfaz
│       │   └── JobTitleImpl.java                        ← lógica + RestTemplate
│       ├── dao/JobTitlesDao.java                        ← JpaRepository
│       ├── entity/JobTitleEntity.java                   ← @Entity + Lombok
│       ├── dto/Respuesta.java                           ← DTO genérico
│       └── JobTitlesApplication.java                    ← @Bean RestTemplate
│
├── Gateway/
│   └── src/main/
│       ├── java/.../GatewayApplication.java             ← @EnableDiscoveryClient
│       └── resources/application.properties             ← rutas + CORS
│
└── Company/ (Angular 22)
    └── src/app/
        ├── navbar/                                      ← navegación global
        │   ├── navbar.ts
        │   ├── navbar.html
        │   └── navbar.css
        │
        ├── employees/                                   ← listado + contenedor de Members
        ├── employee-form/                               ← crear y editar
        ├── employee-delete/                             ← confirmación de eliminación
        │
        ├── departments/
        ├── department-form/
        ├── department-delete/
        │
        ├── jobtitles/
        ├── jobtitle-form/
        ├── jobtitle-delete/
        │
        ├── members/                                     ← tarjetas forkJoin (embebido en Employees)
        │
        ├── services/
        │   ├── employee.ts                              ← HTTP + caché
        │   ├── department-service.ts
        │   └── jobtitle-service.ts
        │
        ├── models/
        │   ├── employees.model.ts
        │   ├── departments.model.ts
        │   └── jobTitles.model.ts
        │
        ├── app.routes.ts                                ← rutas por módulo
        ├── app.html                                     ← navbar + router-outlet + toaster
        └── app.config.ts                                ← provideHttpClient + animationsAsync
```

---

## 8. Backend — Microservicios

### Patrón de Respuesta

| Tipo de operación | Retorno del Service | Códigos HTTP                                                      |
| ----------------- | ------------------- | ----------------------------------------------------------------- |
| Listar todos      | `ResponseEntity<?>` | 200 (con lista), 204 (si vacía)                                   |
| Buscar por ID     | `ResponseEntity<?>` | 200 (con objeto), 204 (si no existe)                              |
| Crear             | `Respuesta` (DTO)   | 200 (envuelto en ResponseEntity)                                  |
| Actualizar        | `Respuesta` (DTO)   | 200 (envuelto en ResponseEntity)                                  |
| Eliminar          | `Respuesta` (DTO)   | 200 (éxito), 404 (no existe), **409 Conflict** (tiene relaciones) |

> **Nota**: el endpoint de eliminación en el controller diferencia entre errores devolviendo `404 NOT_FOUND` cuando el registro no existe y `409 CONFLICT` cuando la eliminación es bloqueada por relaciones activas con otros microservicios.

### DTO `Respuesta`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Respuesta {
    private String mensaje;
    private boolean success;
    private Object obj;
}
```

Desacopla la respuesta de la entidad. El cliente recibe un objeto estructurado con `mensaje`, `success` y `obj`, sin exponer directamente la entidad JPA.

### Endpoints — Microservicio Employees

```
GET    /employees/listar                      → lista todos los empleados
GET    /employees/buscar/{Id}                 → busca por ID
POST   /employees/crear                       → crea un empleado
PUT    /employees/actualizar                  → actualiza un empleado
DELETE /employees/eliminar/{Id}               → elimina (con validación de relaciones)
GET    /employees/exists-by-department/{id}   → ¿hay empleados con este departmentId?
GET    /employees/exists-by-jobtitle/{id}     → ¿hay empleados con este jobTitleId?
GET    /employees/cards                       → lista empleados con nombres de depto y título
```

### Endpoints — Microservicio Departments

```
GET    /departments/listar         → lista todos los departamentos
GET    /departments/buscar/{Id}    → busca por ID
POST   /departments/crear          → crea un departamento
PUT    /departments/actualizar     → actualiza un departamento
DELETE /departments/eliminar/{Id}  → elimina (con validación de relaciones)
```

### Endpoints — Microservicio Job Titles

```
GET    /jobtitles/listar         → lista todos los títulos
GET    /jobtitles/buscar/{Id}    → busca por ID
POST   /jobtitles/crear          → crea un título
PUT    /jobtitles/actualizar     → actualiza un título
DELETE /jobtitles/eliminar/{Id}  → elimina (con validación de relaciones)
```

### Validaciones en el Service

**Al crear (Employees):**

1. Si el ID viene en `0` desde el frontend, se calcula el siguiente ID disponible (`maxId + 1`), ya que no se utiliza `@GeneratedValue`.
2. Verificar si el ID ya existe → rechazar con mensaje.
3. Verificar unicidad por `firstName + lastName` → rechazar con mensaje.
4. Si pasa todas las validaciones → persistir con `save()`.

**Al crear (Departments y Job Titles):**

1. Verificar si el ID ya existe → rechazar con mensaje.
2. Si pasa → persistir con `save()`.

**Al actualizar:**

1. Verificar si el ID **no** existe → rechazar.
2. Si existe → persistir con `save()`.

**Al eliminar:**

1. Verificar si el ID **no** existe → rechazar.
2. Verificar relaciones activas con otros microservicios (ver sección 9).
3. Si no tiene relaciones activas → eliminar con `deleteById()`.

### Validación de Unicidad en el DAO

```java
// EmployeeDao
boolean existsByFirstNameAndLastName(String firstName, String lastName);
boolean existsByDepartmentId(Integer departmentId);
boolean existsByJobTitleId(Integer jobTitleId);
```

Spring Data JPA genera automáticamente el SQL a partir del nombre del método.

---

## 9. Comunicación entre Microservicios

### Problema de Integridad Referencial Distribuida

En una arquitectura de microservicios con bases de datos separadas, no existen foreign keys físicas entre las tablas. Esto significa que, sin validación adicional, sería posible eliminar un departamento que tiene empleados asignados, dejando datos huérfanos.

### Solución Implementada — RestTemplate

Cada microservicio utiliza `RestTemplate` para consultar a los demás antes de ejecutar una eliminación:

#### Eliminación de un Empleado (`ms-employees`)

Antes de eliminar, el servicio verifica si el empleado tiene un `departmentId` y/o `jobTitleId` asignados. Si es así, consulta directamente a `ms-departments` y `ms-jobtitles` para verificar que esos registros existen. Si el departamento o título asignado existe, la eliminación se bloquea indicando las relaciones activas.

```java
// Verificación de relaciones antes de eliminar
if (empleado.getDepartmentId() != null && empleado.getDepartmentId() > 0) {
    Map<?, ?> departamento = restTemplate.getForObject(
        "http://localhost:8082/departments/buscar/{id}", Map.class, empleado.getDepartmentId());
    if (departamento != null) {
        bloqueos.add("departamento");
    }
}
```

Si algún microservicio no responde, la eliminación también se bloquea por seguridad.

#### Eliminación de un Departamento (`ms-departments`)

Antes de eliminar, consulta al microservicio de empleados para verificar si existen empleados asignados a ese departamento:

```java
Boolean inUse = restTemplate.getForObject(
    "http://localhost:8081/employees/exists-by-department/{id}", Boolean.class, Id);
if (Boolean.TRUE.equals(inUse)) {
    return new Respuesta(
        "No se puede eliminar el departamento porque tiene empleados relacionados.",
        false, null);
}
```

#### Eliminación de un Título de Trabajo (`ms-jobtitles`)

Mismo patrón: consulta a `ms-employees` usando el endpoint `exists-by-jobtitle/{id}`:

```java
Boolean inUse = restTemplate.getForObject(
    "http://localhost:8081/employees/exists-by-jobtitle/{id}", Boolean.class, Id);
if (Boolean.TRUE.equals(inUse)) {
    return new Respuesta(
        "No se puede eliminar el título porque tiene empleados relacionados.",
        false, null);
}
```

### Endpoint de Agregación de Datos (`/employees/cards`)

Se implementó un endpoint adicional en `ms-employees` que agrega datos de los tres microservicios en un solo DTO:

```java
@GetMapping("/cards")
public ResponseEntity<?> listarConDetalles() {
    return service.listarEmpleadosConDetalles();
}
```

El servicio itera sobre todos los empleados, consulta vía `RestTemplate` los nombres de departamento y título, y devuelve una lista de `EmployeeCardDto`:

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeCardDto {
    private Integer employeeId;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private Double salary;
    private LocalDate hireDate;
    private Integer departmentId;
    private String departmentName;   // ← nombre resuelto desde ms-departments
    private Integer jobTitleId;
    private String jobTitle;         // ← nombre resuelto desde ms-jobtitles
}
```

### Configuración del Bean RestTemplate

Cada microservicio registra un `@Bean` de `RestTemplate` en su clase `Application`:

```java
@Bean
public RestTemplate restTemplate() {
    return new RestTemplate();
}
```

---

## 10. Configuración de Servicios

### Eureka Server

```properties
server.port=8761
spring.application.name=eureka-server
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
eureka.server.enable-self-preservation=false
```

`self-preservation=false` elimina el mensaje de advertencia EMERGENCY que aparece en desarrollo cuando hay pocos servicios registrados.

### Microservicios (patrón común)

```properties
server.port=8081           # 8082 para departments, 8083 para jobtitles
spring.application.name=employees   # departments, jobTitles

spring.datasource.url=jdbc:postgresql://localhost:5432/Employees
spring.datasource.username=postgres
spring.datasource.password=<contraseña>
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

- `ddl-auto=update` permite que Hibernate cree y actualice las tablas automáticamente.
- `show-sql=true` facilita la depuración mostrando las consultas generadas.

### API Gateway

```properties
server.port=8080
spring.application.name=Gateway
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/

spring.cloud.gateway.discovery.locator.enabled=true
spring.cloud.gateway.discovery.locator.lower-case-service-id=true

spring.cloud.gateway.server.webflux.routes[0].id=ms-employees
spring.cloud.gateway.server.webflux.routes[0].uri=lb://employees
spring.cloud.gateway.server.webflux.routes[0].predicates[0]=Path=/employees/**

spring.cloud.gateway.server.webflux.routes[1].id=ms-departments
spring.cloud.gateway.server.webflux.routes[1].uri=lb://departments
spring.cloud.gateway.server.webflux.routes[1].predicates[0]=Path=/departments/**

spring.cloud.gateway.server.webflux.routes[2].id=ms-jobtitles
spring.cloud.gateway.server.webflux.routes[2].uri=lb://jobtitles
spring.cloud.gateway.server.webflux.routes[2].predicates[0]=Path=/jobtitles/**

# CORS
spring.cloud.gateway.server.webflux.globalcors.cors-configurations.[/**].allowed-origins=http://localhost:4200
spring.cloud.gateway.server.webflux.globalcors.cors-configurations.[/**].allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.cloud.gateway.server.webflux.globalcors.cors-configurations.[/**].allowed-headers=*
spring.cloud.gateway.server.webflux.globalcors.cors-configurations.[/**].allow-credentials=true
```

---

## 11. Frontend — Angular

### Configuración Base (`app.config.ts`)

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(), // ← reemplaza el deprecado provideAnimations
  ],
};
```

### Enrutamiento (`app.routes.ts`)

```typescript
export const routes: Routes = [
  { path: "", redirectTo: "employees", pathMatch: "full" },
  { path: "employees", component: EmployeesComponent },
  { path: "employees/crear", component: EmployeeFormComponent },
  { path: "employees/editar/:id", component: EmployeeFormComponent },
  { path: "employees/eliminar/:id", component: EmployeeDeleteComponent },
  { path: "departments", component: DepartmentsComponent },
  { path: "departments/crear", component: DepartmentFormComponent },
  { path: "departments/editar/:id", component: DepartmentFormComponent },
  { path: "departments/eliminar/:id", component: DepartmentDeleteComponent },
  { path: "jobtitles", component: JobtitlesComponent },
  { path: "jobtitles/crear", component: JobtitleFormComponent },
  { path: "jobtitles/editar/:id", component: JobtitleFormComponent },
  { path: "jobtitles/eliminar/:id", component: JobtitleDeleteComponent },
];
```

### Composición del Layout (`app.html`)

```html
<app-navbar></app-navbar>
<router-outlet />
<ngx-sonner-toaster />
```

### Integración de la Sección "Algunos Miembros"

El componente `MembersComponent` no tiene una ruta propia. Se renderiza como componente hijo embebido directamente en el template de `EmployeesComponent`:

```html
<!-- employees.html (final del archivo) -->
<app-members></app-members>
```

El `EmployeesComponent` importa `DepartmentsComponent`, `JobtitlesComponent` y `MembersComponent` como componentes standalone. Esto significa que cuando el usuario navega a `/employees`, ve la sección de Empleados junto con la sección de Algunos Miembros debajo.

### Service Angular — Patrón de Caché

```typescript
private empleadosCache: Employee[] = [];
private dataLoaded = false;
private needsReload = false;
```

- `needsReload = true` se activa después de cualquier operación de escritura (crear, editar, eliminar).
- Al regresar al listado, si `needsReload === true` → nueva consulta al backend → `setNeedsReload(false)`.
- Si `needsReload === false` → usar caché existente.

**Principio**: La base de datos es siempre la fuente de verdad. El caché solo evita peticiones redundantes durante la navegación.

### Change Detection

Se inyecta `ChangeDetectorRef` en los componentes de listado, formulario, eliminación y miembros para forzar la detección de cambios después de operaciones asíncronas:

```typescript
constructor(private cdr: ChangeDetectorRef) {}

// Después de actualizar estado dentro de un observable:
this.cdr.detectChanges();
```

Situaciones donde se aplica:

- Después de cargar datos del registro en formulario de edición.
- Después de recibir respuesta de crear/actualizar/eliminar.
- Después de capturar un error del backend.
- Después de actualizar el flag `cargando`.

---

## 12. Funcionalidades Implementadas

### Módulo Employees

| Funcionalidad      | Descripción                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| Listar             | Carga bajo demanda (botón "Listar"). Tabla con ID, nombre, email, teléfono, salario y fecha                 |
| Crear              | Formulario en ruta dedicada `/employees/crear`. Validación de ID duplicado y nombre+apellido único          |
| Editar             | Ruta `/employees/editar/:id`. Carga datos existentes vía `GET /buscar/{id}`                                 |
| Eliminar           | Ruta `/employees/eliminar/:id`. Página de confirmación con datos readonly. Validación de relaciones activas |
| Ocultar            | Botón "Dejar de mostrar" que limpia el caché y oculta la tabla                                              |
| Tarjetas (Members) | Sección embebida que muestra tarjetas con datos combinados de las tres entidades                            |

### Módulo Departments

Mismo patrón que Employees, adaptado a un solo campo (`departmentName`). Formulario de 1 columna. La eliminación verifica si existen empleados asignados al departamento.

### Módulo Job Titles

Mismo patrón que Departments. Un solo campo (`jobTitle`). La eliminación verifica si existen empleados con ese título asignado.

### Sección "Algunos Miembros"

Tarjetas visuales que combinan información de las tres entidades: nombre completo del empleado, nombre del departamento y nombre del título de trabajo. Utiliza `forkJoin` de RxJS para ejecutar tres llamadas HTTP en paralelo.

---

## 13. Flujo de Funcionamiento

### Flujo de Listado

```
Usuario → clic "Listar"
  → employeeService.listar()
  → GET http://localhost:8080/employees/listar
  → Backend devuelve lista (200) o vacío (204)
  → setEmpleados(data) → caché en service
  → toast.success / toast.info
  → tabla visible
```

### Flujo de Creación

```
/employees/crear → EmployeeFormComponent (formulario vacío)
  → Usuario completa campos
  → clic "Guardar"
  → validar() → si falla → errores inline
  → POST /employees/crear
  → response.success === false → toast.error(response.mensaje)
  → response.success === true → toast.success → setNeedsReload(true) → /employees
```

### Flujo de Eliminación (con validación de integridad)

```
/employees/eliminar/:id → EmployeeDeleteComponent
  → ngOnInit → GET /employees/buscar/:id → datos readonly
  → Usuario confirma
  → DELETE /employees/eliminar/:id
  → Backend verifica relaciones vía RestTemplate:
    → ¿departmentId asignado? → consulta ms-departments
    → ¿jobTitleId asignado? → consulta ms-jobtitles
    → Si tiene relaciones → 409 CONFLICT + mensaje detallado
    → Si no tiene relaciones → 200 OK + eliminación exitosa
  → respuesta → toast → setNeedsReload(true) → /employees
```

### Flujo de "Algunos Miembros"

```
EmployeesComponent renderiza <app-members>
  → MembersComponent.ngOnInit() → cargarMiembros()
  → forkJoin({
      employees: GET /employees/listar,
      departments: GET /departments/listar,
      jobTitles: GET /jobtitles/listar
    })
  → Combinación en memoria: map empleados con find() en departamentos y títulos
  → Renderizar tarjetas con nombre, iniciales, departamento y título
```

---

## 14. Diseño de la Interfaz

### Sistema de Diseño

Todas las decisiones visuales siguen un sistema coherente con temática oscura:

| Token                         | Valor                                |
| ----------------------------- | ------------------------------------ |
| Fondo principal               | `#090909`                            |
| Superficie cards/tablas       | `#0D0D0D`                            |
| Superficie inputs/header card | `#131313`                            |
| Acento                        | `#E1FB15`                            |
| Texto principal               | `#FFFFFF`                            |
| Texto secundario              | `rgba(255,255,255,0.4)`              |
| Border radius estándar        | `14px`                               |
| Bordes                        | `0.5px solid rgba(255,255,255,0.06)` |

### Navbar

- Fondo `#0D0D0D` con borde inferior sutil.
- Logo SVG + texto "EDELYX" a la izquierda.
- Tres enlaces de navegación: Empleados, Departamentos, Títulos Trabajo.
- Tag "DESARROLLADOR" a la derecha.
- Implementado con `RouterLink` y `RouterLinkActive` para estado activo.

### Tablas

- Contenedor `#0D0D0D`, `border-radius: 12px`.
- Headers en `10px uppercase`, color `rgba(255,255,255,0.3)`.
- Filas con hover sutil.
- Salario formateado con pipe `currency:'MXN'` y destacado en `#E1FB15`.
- Botones de acción: Editar (azul apagado) y Eliminar (rojo apagado).

### Formularios

- Página completa con navegación dedicada.
- Título dinámico (Nuevo / Editar) según el modo.
- Grid de 2 columnas para Employees, 1 columna para Departments y Job Titles.
- Footer con botones Cancelar + Guardar.
- Error inline con borde rojo y mensaje descriptivo.
- Estado loading con botón deshabilitado.

### Tarjetas "Algunos Miembros"

- Card con sección superior `#131313` (avatar centrado).
- Avatar circular `72px` con iniciales en `#E1FB15`.
- Sección inferior con nombre completo, título de trabajo y badge de departamento.
- Botón `↗` decorativo en esquina superior derecha.
- Hover con border accent.

---

## 15. Decisiones Técnicas Relevantes

### Decisión 1 — Separación frontend y backend

| Aspecto      | Detalle                                                              |
| ------------ | -------------------------------------------------------------------- |
| Alternativas | Spring MVC + Thymeleaf, Vaadin                                       |
| Elección     | Spring Boot REST + Angular                                           |
| Motivo       | Desarrollo independiente, escalabilidad separada, patrón profesional |

### Decisión 2 — Un microservicio por entidad

| Aspecto      | Detalle                                                  |
| ------------ | -------------------------------------------------------- |
| Alternativas | Monolito, microservicios agrupados por dominio           |
| Elección     | Un proyecto independiente por entidad                    |
| Motivo       | Autonomía completa de datos, independencia de despliegue |

### Decisión 3 — Sin relaciones JPA, con validación inter-servicio

| Aspecto               | Detalle                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------- |
| Contexto              | Employee tiene `departmentId` y `jobTitleId` que referencian entidades en otros servicios |
| Imposibilidad técnica | JPA no puede establecer `@ManyToOne` entre entidades en BDs distintas                     |
| Solución final        | IDs almacenados como `Integer` + validación de integridad vía `RestTemplate` al eliminar  |

### Decisión 4 — Rutas dedicadas para formularios

| Aspecto        | Detalle                                                       |
| -------------- | ------------------------------------------------------------- |
| Contexto       | Formulario inicial implementado como modal dentro del listado |
| Problema       | UX confusa, inputs desordenados, diseño limitado              |
| Solución final | Página/ruta dedicada para crear, editar y eliminar            |

### Decisión 5 — ngx-sonner para alertas

| Aspecto      | Detalle                                                       |
| ------------ | ------------------------------------------------------------- |
| Alternativas | SweetAlert2, Angular Material Snackbar, Hot Toast             |
| Elección     | ngx-sonner (basada en Sonner de Emil Kowalski)                |
| Motivo       | Diseño moderno y minimalista, coherente con el sistema visual |

### Decisión 6 — Asignación manual de IDs

| Aspecto      | Detalle                                                                   |
| ------------ | ------------------------------------------------------------------------- |
| Contexto     | La entidad `EmpleadoEntity` usa `@Id` sin `@GeneratedValue`               |
| Consecuencia | El ID debe proporcionarse manualmente o calcularse                        |
| Solución     | Cuando el frontend envía `employeeId = 0`, el service calcula `maxId + 1` |

### Decisión 7 — Gateway WebFlux vs. MVC

| Aspecto      | Detalle                                                                                                         |
| ------------ | --------------------------------------------------------------------------------------------------------------- |
| Problema     | Spring Initializr generó la variante MVC del Gateway                                                            |
| Consecuencia | Prefijo de configuración incorrecto, rutas no reconocidas                                                       |
| Solución     | Migrar a `spring-cloud-starter-gateway-server-webflux` con prefijo `spring.cloud.gateway.server.webflux.routes` |

### Decisión 8 — phoneNumber como String

| Aspecto  | Detalle                                                                                                                           |
| -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Problema | Números telefónicos de 10+ dígitos superan el rango de `Integer` (2,147,483,647)                                                  |
| Solución | Cambiar tipo a `String`                                                                                                           |
| Motivo   | Los teléfonos no son valores numéricos: no se hacen operaciones matemáticas, pueden tener ceros iniciales y caracteres especiales |

---

## 16. Evolución de la Solución — Cambios Respecto a la Propuesta Inicial

Durante el desarrollo, varias decisiones de diseño evolucionaron respecto a la propuesta original. Los cambios más significativos se detallan a continuación:

### Cambio 1 — Eliminación con validación de integridad (RestTemplate)

| Aspecto     | Propuesta original                                                                                                                                                   | Implementación final                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Eliminación | `deleteById()` simple sin validaciones cruzadas                                                                                                                      | Validación de relaciones activas vía `RestTemplate` antes de eliminar |
| Motivo      | La eliminación sin verificación dejaba datos huérfanos. Si se borraba un departamento con empleados asignados, los empleados quedaban con un `departmentId` inválido |
| Alcance     | Los tres microservicios implementan validación cruzada                                                                                                               |

### Cambio 2 — Endpoint de agregación en backend (`/employees/cards`)

| Aspecto              | Propuesta original                                                                                                                                                                                      | Implementación final                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Combinación de datos | Exclusivamente en el frontend con `forkJoin`                                                                                                                                                            | **Ambos**: endpoint `/cards` en backend + `forkJoin` en frontend         |
| Motivo               | Se agregó un endpoint backend que devuelve un DTO consolidado (`EmployeeCardDto`) con nombres de departamento y título ya resueltos. El frontend mantiene `forkJoin` para la sección "Algunos miembros" |
| DTO nuevo            | No existía                                                                                                                                                                                              | `EmployeeCardDto` con 12 campos incluyendo `departmentName` y `jobTitle` |

### Cambio 3 — Endpoints adicionales de verificación

| Aspecto   | Propuesta original                                         | Implementación final                                                    |
| --------- | ---------------------------------------------------------- | ----------------------------------------------------------------------- |
| Endpoints | CRUD estándar (5 endpoints por servicio)                   | CRUD + `exists-by-department/{id}`, `exists-by-jobtitle/{id}`, `/cards` |
| Motivo    | Necesarios para la validación de integridad inter-servicio |

### Cambio 4 — Asignación de IDs sin @GeneratedValue

| Aspecto | Propuesta original                  | Implementación final                             |
| ------- | ----------------------------------- | ------------------------------------------------ |
| IDs     | Descritos como "PK autoincremental" | `@Id` sin `@GeneratedValue` — asignación manual  |
| Lógica  | No se detallaba                     | Cuando `employeeId == 0`, se calcula `maxId + 1` |

### Cambio 5 — Validación de unicidad en Departments

| Aspecto             | Propuesta original                               | Implementación final                                                        |
| ------------------- | ------------------------------------------------ | --------------------------------------------------------------------------- |
| DAO Departments     | `existsByDepartmentName()` para validar unicidad | `DepartmentsDao` extiende `JpaRepository` sin métodos derivados adicionales |
| Validación al crear | Verificación de nombre duplicado                 | Solo verificación de ID duplicado (`existsById`)                            |

### Cambio 6 — Nombre de proyecto del frontend

| Aspecto                | Propuesta original | Implementación final |
| ---------------------- | ------------------ | -------------------- |
| Directorio             | `frontend/`        | `Company/`           |
| Nombre en package.json | No especificado    | `"company"`          |

### Cambio 7 — Controller de eliminación con códigos HTTP diferenciados

| Aspecto                  | Propuesta original                        | Implementación final                                                             |
| ------------------------ | ----------------------------------------- | -------------------------------------------------------------------------------- |
| Respuesta de eliminación | Envuelto en `ResponseEntity.ok()` siempre | Diferenciación: `404 NOT_FOUND` si no existe, `409 CONFLICT` si tiene relaciones |

---

## 17. Bitácora de Problemas y Soluciones

### Problema 1 — Eureka arrancaba en puerto 8080

**Causa raíz**: El `application.properties` no estaba en la ubicación correcta o la propiedad de URL estaba mal configurada.
**Solución**: Verificar ubicación y corregir `eureka.client.service-url.defaultZone`.

### Problema 2 — Incompatibilidad Spring Boot 4.1.1 con Spring Cloud

**Causa raíz**: Spring Cloud 2025.1.1 solo es compatible con Boot 4.0.x.
**Solución**: Actualizar a `spring-cloud.version=2025.1.2`.

### Problema 3 — API Gateway devolvía 404 en todas las rutas

**Causa raíz**: Spring Initializr generó la variante MVC del Gateway con prefijo incorrecto.
**Solución**: Migrar a WebFlux + prefijo `spring.cloud.gateway.server.webflux.routes[n]` + agregar `spring-cloud-starter-loadbalancer`.

### Problema 4 — CORS bloqueando peticiones de Angular

**Causa raíz**: Sin configuración CORS en el Gateway.
**Solución**: Agregar configuración CORS global con `allowed-origins=http://localhost:4200`.

### Problema 5 — phoneNumber fuera de rango de Integer

**Causa raíz**: Números de 10 dígitos superan el límite de `int`.
**Solución**: Cambiar tipo a `String`.

### Problema 6 — Formulario modal incrustado en el listado

**Causa raíz**: Modal flotante sin estilos encima de la tabla.
**Solución**: Migrar a rutas dedicadas: `/crear`, `/editar/:id`, `/eliminar/:id`.

### Problema 7 — Sección de Employees duplicada

**Causa raíz**: Componentes referenciados tanto en templates como en `app.component.html`.
**Solución**: Unificar renderizado a través de `router-outlet` + composición por componentes.

### Problema 8 — provideAnimations deprecado

**Causa raíz**: API deprecada en Angular 22.
**Solución**: Migrar a `provideAnimationsAsync()` de `@angular/platform-browser/animations/async`.

### Problema 9 — Error de import en módulo Departments

**Causa raíz**: Archivo `departments.model.ts` (plural) vs. import `department.model` (singular).
**Solución**: Corregir todos los import paths.

### Problema 10 — Error de inyección del DepartmentService

**Causa raíz**: Nombre del archivo del service no coincidía con el import path.
**Solución**: Verificar nombre exacto del archivo y corregir imports.

### Problema 11 — Typo en entidad DepartamentoEntity

**Causa raíz**: Campos definidos como `deparmentId` y `deparmentName` (sin la segunda `t`).
**Solución**: Anotaciones `@JsonProperty("departmentId")` y `@JsonProperty("departmentName")` para corregir la serialización sin alterar la base de datos.

---

## 18. Pruebas

### Pruebas Unitarias de Backend

Se implementaron pruebas unitarias para la capa de servicio de los tres microservicios:

| Microservicio | Archivo de prueba          |
| ------------- | -------------------------- |
| Employees     | `EmployeesImplTest.java`   |
| Departments   | `DepartmentsImplTest.java` |
| Job Titles    | `JobTitleImplTest.java`    |

Las pruebas utilizan mocks (`@Mock`) para el DAO y `RestTemplate`, validando la lógica de negocio de forma aislada.

### Pruebas de Contexto

Cada microservicio incluye una prueba básica de contexto (`ApplicationTests.java`) que verifica que el contexto de Spring Boot carga correctamente.

### Pruebas de Frontend

El proyecto Angular está configurado con Vitest como framework de pruebas (`vitest@4.0.8`), con archivos `.spec.ts` para los componentes y servicios.

---

## 19. Instalación y Configuración

### Prerrequisitos

- Java 17+
- Maven
- PostgreSQL (local)
- Node.js + npm
- Angular CLI 22.x

### Configuración de Bases de Datos

Crear tres bases de datos en PostgreSQL:

```sql
CREATE DATABASE "Employees";
CREATE DATABASE "Departments";   -- verificar nombre exacto en application.properties
CREATE DATABASE "Job_titles";    -- verificar nombre exacto en application.properties
```

Hibernate creará las tablas automáticamente al arrancar (`ddl-auto=update`).

### Configuración de Credenciales

Actualizar las credenciales de PostgreSQL en el `application.properties` de cada microservicio:

```properties
spring.datasource.username=postgres
spring.datasource.password=<tu_contraseña>
```

### Instalación del Frontend

```bash
cd Company
npm install
```

---

## 20. Uso y Ejecución

### Orden de Arranque (importante)

1. **Eureka Server** (primero — los demás dependen de él):

   ```bash
   cd eureka-server
   ./mvnw spring-boot:run
   ```

   Verificar en `http://localhost:8761`

2. **Microservicios** (en cualquier orden entre ellos):

   ```bash
   cd employees && ./mvnw spring-boot:run     # :8081
   cd departments && ./mvnw spring-boot:run    # :8082
   cd jobTitles && ./mvnw spring-boot:run      # :8083
   ```

3. **API Gateway**:

   ```bash
   cd Gateway && ./mvnw spring-boot:run        # :8080
   ```

4. **Frontend Angular**:
   ```bash
   cd Company && npm start                     # :4200
   ```

### Acceso

- **Aplicación**: `http://localhost:4200`
- **Eureka Dashboard**: `http://localhost:8761`
- **Gateway (API)**: `http://localhost:8080`
- **Swagger UI (Employees)**: `http://localhost:8081/swagger-ui.html`

### Ejemplo de Uso via API

```bash
# Listar empleados
curl http://localhost:8080/employees/listar

# Crear departamento
curl -X POST http://localhost:8080/departments/crear \
  -H "Content-Type: application/json" \
  -d '{"deparmentId": 1, "deparmentName": "Ingeniería"}'

# Verificar si un departamento tiene empleados
curl http://localhost:8080/employees/exists-by-department/1

# Obtener tarjetas con datos agregados
curl http://localhost:8080/employees/cards
```

---

## 21. Limitaciones y Consideraciones

1. **Comunicación inter-servicio directa**: Las llamadas RestTemplate usan URLs hardcodeadas (`http://localhost:808x`). En un entorno productivo, deberían usar el nombre del servicio registrado en Eureka con un `RestTemplate` balanceado (`@LoadBalanced`).

2. **Sin @GeneratedValue**: La asignación manual de IDs mediante `maxId + 1` no es segura en escenarios de concurrencia. Para producción, se recomienda implementar generación automática de IDs.

3. **Sin autenticación**: El sistema no implementa Spring Security ni JWT. Todas las rutas están abiertas.

4. **Entorno de desarrollo**: La configuración CORS permite únicamente `localhost:4200`. Las credenciales de base de datos están en texto plano en `application.properties`.

5. **Typo en DepartamentoEntity**: Los campos internos contienen un typo heredado (`deparment` sin `t`), corregido a nivel de serialización con `@JsonProperty` pero no en la base de datos.

6. **Validación de unicidad incompleta en Departments**: El DAO de Departments no implementa `existsByDepartmentName()`, por lo que la validación de nombre duplicado al crear no está activa a nivel de DAO (solo se verifica duplicado por ID).

---

## 22. Lecciones Aprendidas

1. **Verificar la cadena completa antes de diagnosticar**: Problemas que parecían del backend eran frecuentemente de configuración del Gateway o de `application.properties`. Siempre verificar Angular → Gateway → Eureka → Microservicio → BD.

2. **Consultar la matriz de compatibilidad de versiones**: Spring Boot 4.1.1 requiere Spring Cloud 2025.1.2 específicamente. La versión más reciente no es siempre compatible.

3. **El prefijo del Gateway importa**: `spring.cloud.gateway.routes` ≠ `spring.cloud.gateway.mvc.routes` ≠ `spring.cloud.gateway.server.webflux.routes`.

4. **String para datos que parecen numéricos pero no lo son**: Teléfonos, CURPs, códigos postales deben ser `String`.

5. **Separar listado y formularios desde el principio**: Un modal incrustado genera deuda técnica inmediata. Rutas dedicadas evitan refactorizaciones costosas.

6. **Estabilizar un módulo antes de replicar**: Employees fue el módulo de referencia. Todos sus problemas se resolvieron antes de replicar el patrón.

7. **ChangeDetectorRef es una herramienta puntual, no una solución universal**: Debe usarse solo cuando se confirma que la vista no actualiza automáticamente.

8. **No copiar reglas de negocio entre entidades sin analizar**: Cada entidad tiene sus propias reglas de validación.

9. **La integridad referencial no se resuelve sola en microservicios**: Sin foreign keys físicas, la validación cruzada debe implementarse explícitamente en el backend.

10. **La base de datos siempre es la fuente de verdad**: El caché Angular optimiza la navegación pero nunca reemplaza los datos reales.

---

## 23. Estado Final del Proyecto

| Módulo                 | Estado           | Funcionalidades                                                            |
| ---------------------- | ---------------- | -------------------------------------------------------------------------- |
| Eureka Server          | ✅ Completo      | Registro y descubrimiento de servicios                                     |
| API Gateway            | ✅ Completo      | Enrutamiento, load balancing, CORS                                         |
| ms-employees           | ✅ Completo      | CRUD + validaciones + integridad inter-servicio + `/cards` + `exists-by-*` |
| ms-departments         | ✅ Completo      | CRUD + validaciones + integridad inter-servicio vía RestTemplate           |
| ms-jobtitles           | ✅ Completo      | CRUD + validaciones + integridad inter-servicio vía RestTemplate           |
| Navbar Angular         | ✅ Completo      | Navegación con RouterLink, logo SVG, tag Desarrollador                     |
| Employees (frontend)   | ✅ Completo      | Listar, Crear, Editar, Eliminar, caché, alertas, Members embebido          |
| Departments (frontend) | ✅ Completo      | Mismo patrón que Employees                                                 |
| Job Titles (frontend)  | ✅ Completo      | Mismo patrón que Employees                                                 |
| Algunos Miembros       | ✅ Completo      | forkJoin, MemberView, tarjetas con datos combinados                        |
| Pruebas unitarias      | ✅ Implementadas | Service layer de los tres microservicios                                   |
| Documentación API      | ✅ Configurada   | SpringDoc OpenAPI (Swagger UI) en ms-employees                             |

---

## 24. Conclusiones

El sistema EDELYX demuestra la implementación completa de una arquitectura de microservicios funcional, desde la infraestructura de descubrimiento de servicios hasta la interfaz de usuario final. Los principales logros técnicos del proyecto incluyen:

1. **Arquitectura distribuida funcional**: Cinco proyectos Spring Boot (Eureka, Gateway, y tres microservicios) trabajando en conjunto con descubrimiento automático de servicios y enrutamiento dinámico.

2. **Integridad referencial distribuida**: Se implementó un mecanismo de validación cruzada entre microservicios mediante `RestTemplate` que impide la eliminación de registros con relaciones activas, resolviendo uno de los desafíos fundamentales de las arquitecturas distribuidas.

3. **Agregación de datos inter-servicio**: El problema de combinar datos de múltiples fuentes se resolvió con dos estrategias complementarias: un endpoint de agregación en el backend (`/employees/cards`) y composición en el frontend mediante `forkJoin`.

4. **Frontend moderno y desacoplado**: Angular 22 con standalone components, RxJS para manejo reactivo, sistema de caché inteligente con flag de recarga, y un sistema de diseño oscuro coherente.

5. **Evolución iterativa de la solución**: El proyecto evolucionó desde una propuesta inicial más simple (eliminación sin validación, combinación solo en frontend, IDs autogenerados) hacia una implementación más robusta que incorpora validación de integridad, endpoints de agregación y manejo explícito de relaciones entre servicios.

El resultado es un sistema funcional que, si bien está diseñado para un entorno de desarrollo, establece las bases arquitectónicas correctas para una aplicación de gestión empresarial basada en microservicios.

---

> **Nota**: Esta documentación refleja el estado final del proyecto tras todas las modificaciones realizadas durante el desarrollo. Cuando la implementación difiere de la propuesta de diseño original, se documenta la versión implementada como la versión oficial, con referencia al cambio cuando es relevante para la comprensión del proyecto.
