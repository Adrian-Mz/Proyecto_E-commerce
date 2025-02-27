PGDMP  $    +                 }         
   e-commerce    17.2    17.2 l    }           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            ~           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    38508 
   e-commerce    DATABASE     �   CREATE DATABASE "e-commerce" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Ecuador.1252';
    DROP DATABASE "e-commerce";
                     postgres    false                        2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                     postgres    false            �           0    0    SCHEMA public    COMMENT         COMMENT ON SCHEMA public IS '';
                        postgres    false    5            �           0    0    SCHEMA public    ACL     +   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
                        postgres    false    5            �            1259    38509    _prisma_migrations    TABLE     �  CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);
 &   DROP TABLE public._prisma_migrations;
       public         heap r       postgres    false    5            �            1259    38516    carrito    TABLE     [   CREATE TABLE public.carrito (
    id integer NOT NULL,
    "usuarioId" integer NOT NULL
);
    DROP TABLE public.carrito;
       public         heap r       postgres    false    5            �            1259    38519    carrito_id_seq    SEQUENCE     �   CREATE SEQUENCE public.carrito_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.carrito_id_seq;
       public               postgres    false    218    5            �           0    0    carrito_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.carrito_id_seq OWNED BY public.carrito.id;
          public               postgres    false    219            �            1259    38520    carrito_productos    TABLE     �   CREATE TABLE public.carrito_productos (
    id integer NOT NULL,
    "carritoId" integer NOT NULL,
    "productoId" integer NOT NULL,
    cantidad integer NOT NULL,
    precio_unitario numeric(65,30) DEFAULT 0.0 NOT NULL
);
 %   DROP TABLE public.carrito_productos;
       public         heap r       postgres    false    5            �            1259    38524    carrito_productos_id_seq    SEQUENCE     �   CREATE SEQUENCE public.carrito_productos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.carrito_productos_id_seq;
       public               postgres    false    220    5            �           0    0    carrito_productos_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.carrito_productos_id_seq OWNED BY public.carrito_productos.id;
          public               postgres    false    221            �            1259    38525 
   categorias    TABLE     u   CREATE TABLE public.categorias (
    id integer NOT NULL,
    nombre text NOT NULL,
    descripcion text NOT NULL
);
    DROP TABLE public.categorias;
       public         heap r       postgres    false    5            �            1259    38530    categorias_id_seq    SEQUENCE     �   CREATE SEQUENCE public.categorias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.categorias_id_seq;
       public               postgres    false    222    5            �           0    0    categorias_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.categorias_id_seq OWNED BY public.categorias.id;
          public               postgres    false    223            �            1259    38531    devoluciones    TABLE     )  CREATE TABLE public.devoluciones (
    id integer NOT NULL,
    "pedidoId" integer NOT NULL,
    motivo text NOT NULL,
    "estadoId" integer NOT NULL,
    "fechaDevolucion" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "fechaResolucion" timestamp(3) without time zone
);
     DROP TABLE public.devoluciones;
       public         heap r       postgres    false    5            �            1259    38537    devoluciones_id_seq    SEQUENCE     �   CREATE SEQUENCE public.devoluciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.devoluciones_id_seq;
       public               postgres    false    5    224            �           0    0    devoluciones_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.devoluciones_id_seq OWNED BY public.devoluciones.id;
          public               postgres    false    225            �            1259    38538    estado    TABLE     q   CREATE TABLE public.estado (
    id integer NOT NULL,
    nombre text NOT NULL,
    descripcion text NOT NULL
);
    DROP TABLE public.estado;
       public         heap r       postgres    false    5            �            1259    38543    estado_id_seq    SEQUENCE     �   CREATE SEQUENCE public.estado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.estado_id_seq;
       public               postgres    false    5    226            �           0    0    estado_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.estado_id_seq OWNED BY public.estado.id;
          public               postgres    false    227            �            1259    38544    metodo_envio    TABLE     �   CREATE TABLE public.metodo_envio (
    id integer NOT NULL,
    nombre text NOT NULL,
    descripcion text NOT NULL,
    costo numeric(65,30) DEFAULT 0.0 NOT NULL,
    "tiempoEstimado" text NOT NULL
);
     DROP TABLE public.metodo_envio;
       public         heap r       postgres    false    5            �            1259    38550    metodo_envio_id_seq    SEQUENCE     �   CREATE SEQUENCE public.metodo_envio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.metodo_envio_id_seq;
       public               postgres    false    228    5            �           0    0    metodo_envio_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.metodo_envio_id_seq OWNED BY public.metodo_envio.id;
          public               postgres    false    229            �            1259    38551    metodo_pago    TABLE     v   CREATE TABLE public.metodo_pago (
    id integer NOT NULL,
    nombre text NOT NULL,
    descripcion text NOT NULL
);
    DROP TABLE public.metodo_pago;
       public         heap r       postgres    false    5            �            1259    38556    metodo_pago_id_seq    SEQUENCE     �   CREATE SEQUENCE public.metodo_pago_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.metodo_pago_id_seq;
       public               postgres    false    230    5            �           0    0    metodo_pago_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.metodo_pago_id_seq OWNED BY public.metodo_pago.id;
          public               postgres    false    231            �            1259    39959    pedido_productos    TABLE     �   CREATE TABLE public.pedido_productos (
    id integer NOT NULL,
    "pedidoId" integer NOT NULL,
    "productoId" integer NOT NULL,
    cantidad integer NOT NULL,
    precio_unitario numeric(65,30) DEFAULT 0.0 NOT NULL
);
 $   DROP TABLE public.pedido_productos;
       public         heap r       postgres    false    5            �            1259    39958    pedido_productos_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pedido_productos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.pedido_productos_id_seq;
       public               postgres    false    5    241            �           0    0    pedido_productos_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.pedido_productos_id_seq OWNED BY public.pedido_productos.id;
          public               postgres    false    240            �            1259    38557    pedidos    TABLE     �  CREATE TABLE public.pedidos (
    id integer NOT NULL,
    "usuarioId" integer NOT NULL,
    "direccionEnvio" text NOT NULL,
    "metodoPagoId" integer NOT NULL,
    "metodoEnvioId" integer NOT NULL,
    "estadoId" integer NOT NULL,
    total numeric(65,30) DEFAULT 0.0 NOT NULL,
    "fechaPedido" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "fechaActualizacion" timestamp(3) without time zone
);
    DROP TABLE public.pedidos;
       public         heap r       postgres    false    5            �            1259    38564    pedidos_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pedidos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.pedidos_id_seq;
       public               postgres    false    5    232            �           0    0    pedidos_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.pedidos_id_seq OWNED BY public.pedidos.id;
          public               postgres    false    233            �            1259    38565 	   productos    TABLE     W  CREATE TABLE public.productos (
    id integer NOT NULL,
    nombre text NOT NULL,
    descripcion text NOT NULL,
    precio numeric(65,30) DEFAULT 0.0 NOT NULL,
    stock integer NOT NULL,
    imagen text NOT NULL,
    "categoriaId" integer NOT NULL,
    "promocionId" integer,
    especificaciones text,
    marca text,
    garantia text
);
    DROP TABLE public.productos;
       public         heap r       postgres    false    5            �            1259    38571    productos_id_seq    SEQUENCE     �   CREATE SEQUENCE public.productos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.productos_id_seq;
       public               postgres    false    5    234            �           0    0    productos_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.productos_id_seq OWNED BY public.productos.id;
          public               postgres    false    235            �            1259    38572    promociones    TABLE     
  CREATE TABLE public.promociones (
    id integer NOT NULL,
    nombre text NOT NULL,
    descripcion text NOT NULL,
    descuento numeric(65,30) DEFAULT 0.0 NOT NULL,
    "fechaInicio" timestamp(3) without time zone,
    "fechaFin" timestamp(3) without time zone
);
    DROP TABLE public.promociones;
       public         heap r       postgres    false    5            �            1259    38578    promociones_id_seq    SEQUENCE     �   CREATE SEQUENCE public.promociones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.promociones_id_seq;
       public               postgres    false    5    236            �           0    0    promociones_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.promociones_id_seq OWNED BY public.promociones.id;
          public               postgres    false    237            �            1259    38579    usuarios    TABLE     �  CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre text NOT NULL,
    apellido text NOT NULL,
    correo text NOT NULL,
    password text NOT NULL,
    direccion text NOT NULL,
    telefono text NOT NULL,
    pais text NOT NULL,
    "fechaNacimiento" timestamp(3) without time zone,
    "fechaRegistro" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public.usuarios;
       public         heap r       postgres    false    5            �            1259    38585    usuarios_id_seq    SEQUENCE     �   CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.usuarios_id_seq;
       public               postgres    false    238    5            �           0    0    usuarios_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;
          public               postgres    false    239            �           2604    38586 
   carrito id    DEFAULT     h   ALTER TABLE ONLY public.carrito ALTER COLUMN id SET DEFAULT nextval('public.carrito_id_seq'::regclass);
 9   ALTER TABLE public.carrito ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    219    218            �           2604    38587    carrito_productos id    DEFAULT     |   ALTER TABLE ONLY public.carrito_productos ALTER COLUMN id SET DEFAULT nextval('public.carrito_productos_id_seq'::regclass);
 C   ALTER TABLE public.carrito_productos ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    221    220            �           2604    38588    categorias id    DEFAULT     n   ALTER TABLE ONLY public.categorias ALTER COLUMN id SET DEFAULT nextval('public.categorias_id_seq'::regclass);
 <   ALTER TABLE public.categorias ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    223    222            �           2604    38589    devoluciones id    DEFAULT     r   ALTER TABLE ONLY public.devoluciones ALTER COLUMN id SET DEFAULT nextval('public.devoluciones_id_seq'::regclass);
 >   ALTER TABLE public.devoluciones ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    225    224            �           2604    38590 	   estado id    DEFAULT     f   ALTER TABLE ONLY public.estado ALTER COLUMN id SET DEFAULT nextval('public.estado_id_seq'::regclass);
 8   ALTER TABLE public.estado ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    227    226            �           2604    38591    metodo_envio id    DEFAULT     r   ALTER TABLE ONLY public.metodo_envio ALTER COLUMN id SET DEFAULT nextval('public.metodo_envio_id_seq'::regclass);
 >   ALTER TABLE public.metodo_envio ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    229    228            �           2604    38592    metodo_pago id    DEFAULT     p   ALTER TABLE ONLY public.metodo_pago ALTER COLUMN id SET DEFAULT nextval('public.metodo_pago_id_seq'::regclass);
 =   ALTER TABLE public.metodo_pago ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    231    230            �           2604    39962    pedido_productos id    DEFAULT     z   ALTER TABLE ONLY public.pedido_productos ALTER COLUMN id SET DEFAULT nextval('public.pedido_productos_id_seq'::regclass);
 B   ALTER TABLE public.pedido_productos ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    241    240    241            �           2604    38593 
   pedidos id    DEFAULT     h   ALTER TABLE ONLY public.pedidos ALTER COLUMN id SET DEFAULT nextval('public.pedidos_id_seq'::regclass);
 9   ALTER TABLE public.pedidos ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    233    232            �           2604    38594    productos id    DEFAULT     l   ALTER TABLE ONLY public.productos ALTER COLUMN id SET DEFAULT nextval('public.productos_id_seq'::regclass);
 ;   ALTER TABLE public.productos ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    235    234            �           2604    38595    promociones id    DEFAULT     p   ALTER TABLE ONLY public.promociones ALTER COLUMN id SET DEFAULT nextval('public.promociones_id_seq'::regclass);
 =   ALTER TABLE public.promociones ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    237    236            �           2604    38596    usuarios id    DEFAULT     j   ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);
 :   ALTER TABLE public.usuarios ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    239    238            b          0    38509    _prisma_migrations 
   TABLE DATA           �   COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
    public               postgres    false    217   `�       c          0    38516    carrito 
   TABLE DATA           2   COPY public.carrito (id, "usuarioId") FROM stdin;
    public               postgres    false    218   ��       e          0    38520    carrito_productos 
   TABLE DATA           e   COPY public.carrito_productos (id, "carritoId", "productoId", cantidad, precio_unitario) FROM stdin;
    public               postgres    false    220   ʇ       g          0    38525 
   categorias 
   TABLE DATA           =   COPY public.categorias (id, nombre, descripcion) FROM stdin;
    public               postgres    false    222   �       i          0    38531    devoluciones 
   TABLE DATA           p   COPY public.devoluciones (id, "pedidoId", motivo, "estadoId", "fechaDevolucion", "fechaResolucion") FROM stdin;
    public               postgres    false    224   Z�       k          0    38538    estado 
   TABLE DATA           9   COPY public.estado (id, nombre, descripcion) FROM stdin;
    public               postgres    false    226   w�       m          0    38544    metodo_envio 
   TABLE DATA           X   COPY public.metodo_envio (id, nombre, descripcion, costo, "tiempoEstimado") FROM stdin;
    public               postgres    false    228   ��       o          0    38551    metodo_pago 
   TABLE DATA           >   COPY public.metodo_pago (id, nombre, descripcion) FROM stdin;
    public               postgres    false    230   c�       z          0    39959    pedido_productos 
   TABLE DATA           c   COPY public.pedido_productos (id, "pedidoId", "productoId", cantidad, precio_unitario) FROM stdin;
    public               postgres    false    241   Ҋ       q          0    38557    pedidos 
   TABLE DATA           �   COPY public.pedidos (id, "usuarioId", "direccionEnvio", "metodoPagoId", "metodoEnvioId", "estadoId", total, "fechaPedido", "fechaActualizacion") FROM stdin;
    public               postgres    false    232   %�       s          0    38565 	   productos 
   TABLE DATA           �   COPY public.productos (id, nombre, descripcion, precio, stock, imagen, "categoriaId", "promocionId", especificaciones, marca, garantia) FROM stdin;
    public               postgres    false    234   ͋       u          0    38572    promociones 
   TABLE DATA           d   COPY public.promociones (id, nombre, descripcion, descuento, "fechaInicio", "fechaFin") FROM stdin;
    public               postgres    false    236   �       w          0    38579    usuarios 
   TABLE DATA           �   COPY public.usuarios (id, nombre, apellido, correo, password, direccion, telefono, pais, "fechaNacimiento", "fechaRegistro") FROM stdin;
    public               postgres    false    238   �       �           0    0    carrito_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.carrito_id_seq', 4, true);
          public               postgres    false    219            �           0    0    carrito_productos_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.carrito_productos_id_seq', 7, true);
          public               postgres    false    221            �           0    0    categorias_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.categorias_id_seq', 3, true);
          public               postgres    false    223            �           0    0    devoluciones_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.devoluciones_id_seq', 1, false);
          public               postgres    false    225            �           0    0    estado_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.estado_id_seq', 1, false);
          public               postgres    false    227            �           0    0    metodo_envio_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.metodo_envio_id_seq', 2, true);
          public               postgres    false    229            �           0    0    metodo_pago_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.metodo_pago_id_seq', 3, true);
          public               postgres    false    231            �           0    0    pedido_productos_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.pedido_productos_id_seq', 6, true);
          public               postgres    false    240            �           0    0    pedidos_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.pedidos_id_seq', 4, true);
          public               postgres    false    233            �           0    0    productos_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.productos_id_seq', 7, true);
          public               postgres    false    235            �           0    0    promociones_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.promociones_id_seq', 2, true);
          public               postgres    false    237            �           0    0    usuarios_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.usuarios_id_seq', 14, true);
          public               postgres    false    239            �           2606    38598 *   _prisma_migrations _prisma_migrations_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
       public                 postgres    false    217            �           2606    38600    carrito carrito_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.carrito
    ADD CONSTRAINT carrito_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.carrito DROP CONSTRAINT carrito_pkey;
       public                 postgres    false    218            �           2606    38602 (   carrito_productos carrito_productos_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.carrito_productos
    ADD CONSTRAINT carrito_productos_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.carrito_productos DROP CONSTRAINT carrito_productos_pkey;
       public                 postgres    false    220            �           2606    38604    categorias categorias_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.categorias DROP CONSTRAINT categorias_pkey;
       public                 postgres    false    222            �           2606    38606    devoluciones devoluciones_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.devoluciones
    ADD CONSTRAINT devoluciones_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.devoluciones DROP CONSTRAINT devoluciones_pkey;
       public                 postgres    false    224            �           2606    38608    estado estado_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.estado
    ADD CONSTRAINT estado_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.estado DROP CONSTRAINT estado_pkey;
       public                 postgres    false    226            �           2606    38610    metodo_envio metodo_envio_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.metodo_envio
    ADD CONSTRAINT metodo_envio_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.metodo_envio DROP CONSTRAINT metodo_envio_pkey;
       public                 postgres    false    228            �           2606    38612    metodo_pago metodo_pago_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.metodo_pago
    ADD CONSTRAINT metodo_pago_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.metodo_pago DROP CONSTRAINT metodo_pago_pkey;
       public                 postgres    false    230            �           2606    39965 &   pedido_productos pedido_productos_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.pedido_productos
    ADD CONSTRAINT pedido_productos_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.pedido_productos DROP CONSTRAINT pedido_productos_pkey;
       public                 postgres    false    241            �           2606    38614    pedidos pedidos_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.pedidos DROP CONSTRAINT pedidos_pkey;
       public                 postgres    false    232            �           2606    38616    productos productos_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.productos DROP CONSTRAINT productos_pkey;
       public                 postgres    false    234            �           2606    38618    promociones promociones_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.promociones
    ADD CONSTRAINT promociones_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.promociones DROP CONSTRAINT promociones_pkey;
       public                 postgres    false    236            �           2606    38620    usuarios usuarios_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_pkey;
       public                 postgres    false    238            �           1259    38621    usuarios_correo_key    INDEX     Q   CREATE UNIQUE INDEX usuarios_correo_key ON public.usuarios USING btree (correo);
 '   DROP INDEX public.usuarios_correo_key;
       public                 postgres    false    238            �           2606    38622 2   carrito_productos carrito_productos_carritoId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.carrito_productos
    ADD CONSTRAINT "carrito_productos_carritoId_fkey" FOREIGN KEY ("carritoId") REFERENCES public.carrito(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 ^   ALTER TABLE ONLY public.carrito_productos DROP CONSTRAINT "carrito_productos_carritoId_fkey";
       public               postgres    false    4780    218    220            �           2606    38627 3   carrito_productos carrito_productos_productoId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.carrito_productos
    ADD CONSTRAINT "carrito_productos_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES public.productos(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 _   ALTER TABLE ONLY public.carrito_productos DROP CONSTRAINT "carrito_productos_productoId_fkey";
       public               postgres    false    4796    234    220            �           2606    38632    carrito carrito_usuarioId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.carrito
    ADD CONSTRAINT "carrito_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 J   ALTER TABLE ONLY public.carrito DROP CONSTRAINT "carrito_usuarioId_fkey";
       public               postgres    false    238    218    4801            �           2606    38637 '   devoluciones devoluciones_estadoId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.devoluciones
    ADD CONSTRAINT "devoluciones_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES public.estado(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 S   ALTER TABLE ONLY public.devoluciones DROP CONSTRAINT "devoluciones_estadoId_fkey";
       public               postgres    false    224    226    4788            �           2606    38642 '   devoluciones devoluciones_pedidoId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.devoluciones
    ADD CONSTRAINT "devoluciones_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES public.pedidos(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 S   ALTER TABLE ONLY public.devoluciones DROP CONSTRAINT "devoluciones_pedidoId_fkey";
       public               postgres    false    224    232    4794            �           2606    39966 /   pedido_productos pedido_productos_pedidoId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.pedido_productos
    ADD CONSTRAINT "pedido_productos_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES public.pedidos(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 [   ALTER TABLE ONLY public.pedido_productos DROP CONSTRAINT "pedido_productos_pedidoId_fkey";
       public               postgres    false    4794    232    241            �           2606    39971 1   pedido_productos pedido_productos_productoId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.pedido_productos
    ADD CONSTRAINT "pedido_productos_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES public.productos(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 ]   ALTER TABLE ONLY public.pedido_productos DROP CONSTRAINT "pedido_productos_productoId_fkey";
       public               postgres    false    241    234    4796            �           2606    38647    pedidos pedidos_estadoId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT "pedidos_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES public.estado(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 I   ALTER TABLE ONLY public.pedidos DROP CONSTRAINT "pedidos_estadoId_fkey";
       public               postgres    false    4788    232    226            �           2606    38652 "   pedidos pedidos_metodoEnvioId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT "pedidos_metodoEnvioId_fkey" FOREIGN KEY ("metodoEnvioId") REFERENCES public.metodo_envio(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 N   ALTER TABLE ONLY public.pedidos DROP CONSTRAINT "pedidos_metodoEnvioId_fkey";
       public               postgres    false    4790    232    228            �           2606    38657 !   pedidos pedidos_metodoPagoId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT "pedidos_metodoPagoId_fkey" FOREIGN KEY ("metodoPagoId") REFERENCES public.metodo_pago(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 M   ALTER TABLE ONLY public.pedidos DROP CONSTRAINT "pedidos_metodoPagoId_fkey";
       public               postgres    false    230    4792    232            �           2606    38662    pedidos pedidos_usuarioId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT "pedidos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 J   ALTER TABLE ONLY public.pedidos DROP CONSTRAINT "pedidos_usuarioId_fkey";
       public               postgres    false    238    232    4801            �           2606    38667 $   productos productos_categoriaId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.productos
    ADD CONSTRAINT "productos_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES public.categorias(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 P   ALTER TABLE ONLY public.productos DROP CONSTRAINT "productos_categoriaId_fkey";
       public               postgres    false    222    4784    234            �           2606    38672 $   productos productos_promocionId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.productos
    ADD CONSTRAINT "productos_promocionId_fkey" FOREIGN KEY ("promocionId") REFERENCES public.promociones(id) ON UPDATE CASCADE ON DELETE SET NULL;
 P   ALTER TABLE ONLY public.productos DROP CONSTRAINT "productos_promocionId_fkey";
       public               postgres    false    236    234    4798            b   +  x�m�[n�0�og� �y��"�� �� F�8����N�� qt��\*�Db��DS���6l
Q՜v�F)VhJiGw�ڣ�QB�V luԮl��������# IH	�=����WP+5��=E�,y����{�u�n��|=�wm� K�D�8H�cZ�+%�.2v-sm�c��T�X��=2+Y��j���g��j��`�_���'1.�%~�"���i��6N��<m�Oǿ���c
ˇe���i��$��³'��u�U��Za��:7i.룽�N�%H�^;�v�f��Ց�9��O�{���}���|Z0�A��5��<�����=O?�i{>��u��.?X�pyg97GCK5'a��<�0Vhu)��(�Á}����P�����-����}9�֭E�c��B`�G;h9�T���ZB-o�?�<�֞|���9�qm,���1Q�����dtM�,�ԉ���a����;P&�ܣI6�!>F+�=��7�!����bʔF�0���!�Z��=�~g�7V�_���=���=�����z0      c      x�3�4�2�44�2�44�2�4����� $-�      e   <   x�3�4BcN3KK=KK<�˘x�&�F@�F�(5*3�4�4&�Ԝd��%a�1z\\\ v�&,      g   4  x�uQKN�0]�O� �ϲmD�D��c3���+�l�@,Y��N�H��x��~��DQ^�5F��J���≤&Y����-�9R@e�Ώ�u����D�$�1���#�	�(��@Q�Au��{��lM�g
�w�i�{x�p���7��:�v�h�tFNԓ�qİx��D�Ɋ6p��u��ϰ����'
��#��M:{��'�'C��O��	*�Y]�rW��P���gxm���bM����
,���*�l�Wz�%9�������tk�Rܴ�#��%Z��ܰX�́��w�Ir��w�hWB��L�~      i      x������ � �      k   p   x�3�H�K�L�+I�t�Q(HM�L�WH-.9�ȁ�(��*�'�'��8 ���|}�@5@TGJ��1�k^Yf"�ڌD�B����	PQIQj:.eP9=�=... (�@]      m   \   x�3�L�((J-.�t�+;�6_���̔|#]c���k�59��N�b.C���ļ��"��@�� S]s������������ !�0u      o   _   x�uʱ	�@��2E&�E�曋r�9�Y�9\L�����>���Y]M
Ҁ���B�c<�^@m�KԷK5������� u)����y<FcCD�/�      z   C   x�����0��Q�b�zI�u���}���$B�󓱨��=�b��o��yJ`K'���[�3[��-�      q   �   x���1�0Eg�9 �l�M⬝�]*ڡR%&$��9�*{!�Ky���b0L۶�x
�z��9�K8����z�����_�j�h'9p��U�</�?5���Tvʱ����&&'�fw�l�{J����E-�٥I%p��U'1;��#!���g�      s   %  x��WMo۸]�����`\G�e/��U�֝���y���(L$QCJ����,f1��l���^R�e'x
$u���\�$dKQ����⚾�2�N���:|˂>���毂�V<����;9��xI�XQl r�н+S�y�+U�U��y�����D�K���d�O�⚲D���e\w���T�%l�i��D�]wh.b%_ck���/�i@+ MӄS�*Y�MNWo.;����l�e��A$
vQ�D�.9$��`ۚ�W��%R�Β�a��o�H0�4��|�3��fۥ��e���E"rIK@8I��'��� ��!��_ ��+`9�u^����!�𜲻ZWli��e^�J��s-�{^izYT��pL]��㜹�� �����:���\m��c�I�դ�Q�l�;�#Z�v� ���>�R2��l���NE���S��=@Cʋ-�wO�p���������>��B|�C����g\j���[�I��f2��inX��ix�h�\J�+|x��h�;�W�:�o7��w0=Ǣݞ���|��\*��d2�5������c�b�l��D�X�I�$�s�B�Swq�<N�1f�
iP���X����)��I"}�$2��H��>��B��{���bL������j�f�� 2��	�`73��&���؝�:ױ�Ć^�6^�[���ŨŃ�4a�n�1C}2��p�g�GL�q =T�o7(iAH�<f G�3pv��,�P^h�>��S���8��q�T1�j���=�	�>��LA�W�*�8/��<B����{��O3����"*'��t��Ymu%�|[	�8�`�z��`��jˡ��ރ����%��e�g�u�Xn�������� �ݣR�\Թ�Xk���;8͠����qUE�zgVW����������-LIeY��?�*�&�mU������z�j.$#
�=��L@�{���b����� �u�n(��m�7F`{\3��O��ݡ��h5�w4k��И��Û	�
�h���Q��,��G���D-2^ �����_�֏@I@�Cǹ>��c��V' ��V�a�1BFA����m�=�Ӳ�;4`a-�?��7m������G�4bI�����c L�����)(a�=	NF�9=����h�њkL�y����h���V�QJZ�TJ�t[��eBϡ��i�o�=/x:�������&�q�^������x���)+q��>��+��v|�8�B��T@ߵ8p�Ԋ-�?����;ڪ�z�����p-�,5s���dFz�GՀ4�1]먪o����o����r1���㨳����|]ĝf:���Ș�JܘT���A}װ�s(|H���G�P��9vVx����xK���C�?� ��a�h;�=�;!����sc
ƌR��sY��9���]����R�%�!k�-��(5��i9��f��i��m�-6|�Ʋ�$�d��-�Ͳ
��.d�ޖ�+<߹4�;_��s��S������2K^te�0��� }5��D�P��;�#�삥M�t%oo������(v����ך.i%�"�G���l���^d(�H (���|��{a�ڌ�Y�Ѱ��=�EN���(�U�1������-��x+w��ر��g�-s<e@�UnX�^������������	}m�+���g�������ݘ|����쥄q��N�WZ'�}�n�6��� �3ئ)B^�t�k_��,2;ʞ������s����dp��>��u_�z�N�w�      u     x����N�0���SxaLe�ql �Ē$�.�s��W�I$��y1�
��Z��|���N�E�QhY�S��A�YQ�� WW�k9�H59�9`�1��ԯ�26SE��T�|�Ov��G&�pK��q�}zOMr1껋Ö����e�1Mg����-�J�}��{~�F~\�6��;����	�5�'y�$����GJ�i���F	�˲���E�Lw�f��mDw~�����J����C|Xv��ke�X̄L�      w   :  x����r�8���Sx�-B�%�Vs'0!�l� �-�7o4�Y�#��Z����f�f��������G:��Os�p���} ��	����;�i�F�#�&����"�v�r�ĥWϳp:�����l��j�}�W=P+�:�,:$L��ցc[&����}�'UGIΖh�C*�T4�"�^/�#W4��lUs\Ms	�Y�"Zʏւ,�!?ӕ �C�6w9�o�����$�sqXW��>�-�ʋ}�@�us��Ȳ�5�"B	P{�HA�',�˷X]1��da� �sAͷ��Q��b�504�����c��i��cAc��EDc1��8���|:��0)�c�>�v���V���]n��>K�m$�OE���&�e;��'�
����VLГ���������=+���~%߰(�����m�K�=����3��*��<���_�C~���>=����lYO��a��S�J�ߠ��w�"�$jX�@Olc�L�+���ɍ�`���9��0Ụ3���zn�a	��r�Nk������6�FG���O)���W'���#�OjX�o�R5�"��D�Z�|��x"���8�.�7�ᯨS�<��f��h��9[�g���K��n#J�v\��E��:C����'Ċ#�Pg�]S-�5�A3��(%IT��@�Tɩc�@Бb�+�Q|M�o�	�ύ�/G�BZ�K���U_3 �$�I��P��W�����nj�&����P���a�$)h�|��΍�.i�lҫG������Z�'sn��g���Q?+v�sߘ����v=/��Œ��-�L����N_�}�*���KLhZ��T�;߂�     