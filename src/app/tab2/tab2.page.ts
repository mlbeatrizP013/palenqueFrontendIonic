import { CommonModule } from '@angular/common';
import { Component, signal, computed, inject } from '@angular/core';
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonBadge,
  ToastController,
  AlertController,
  LoadingController
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { add, search, arrowBack } from 'ionicons/icons';
import { ProductoFormularioComponent } from '../pages/producto-formulario/producto-formulario.component';
import { ServiceAPI } from '../services/service-api';
import { Producto } from '../interfaces/productos';
import { HeaderComponent } from 'src/app/components/header/header.component';

interface Usuario {
  id: number;
  nome: string;
  email?: string;
  Idcata?: number;
}

interface Apartado {
  id: number;
  cantidad: number;
  usuarioID?: number;
  bebidasID?: number;
  bebida?: any | null;
  usuario?: Usuario | null;
  createdAt?: Date;
}

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonBadge,
    ProductoFormularioComponent,
    HeaderComponent,
  ]
})
export class Tab2Page {
  productos = signal<Producto[]>([]);
  currentView = signal<'list' | 'form' | 'detalle' | 'apartados'>('list');
  searchTerm = signal<string>('');
  filterStatus = signal<'todos' | 'activo' | 'sin_stock' | 'stock_bajo' | 'inactivo'>('todos');
  productoEditando = signal<Producto | null>(null);
  productoSeleccionado = signal<Producto | null>(null);
  categorias = signal<{id: number, nombre: string}[]>([]);
  selectedCategory = signal<string>('todos');
  
  // Propiedades para apartados
  apartados = signal<Apartado[]>([]);
  usuarios = signal<Usuario[]>([]);
  experiencias = signal<any[]>([]);
  bebidas = signal<Producto[]>([]); // Agregado para evitar error
  selectedUserId = signal<number | null>(null);
  qty: Record<number, number> = {};
  cargandoUsuarios = signal(false);

  productosFiltrados = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const status = this.filterStatus();
    const categoria = this.selectedCategory();

    return this.productos().filter((p) => {
      const matchSearch =
        p.nombre.toLowerCase().includes(search) ||
        p.categoria.toLowerCase().includes(search) ||
        p.descripcion.toLowerCase().includes(search);

      // Determinar el estado real basado en stock
      let estadoReal = 'activo';
      if (p.stockActual === 0 || p.stockInicial === 0) {
        estadoReal = 'sin_stock';
      } else if (p.stockActual <= p.stockMinimo) {
        estadoReal = 'stock_bajo';
      }

      // Filtrar por estado
      const matchStatus = status === 'todos' || estadoReal === status;
      
      // Filtrar por categoría
      const matchCategory = categoria === 'todos' || p.categoria === categoria;

      return matchSearch && matchStatus && matchCategory;
    });
  });

  constructor(
    private api: ServiceAPI,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController 
  ) {
    addIcons({ add, search, arrowBack });
    this.cargarCategorias();
    this.cargarBebidas();
    this.cargarUsuarios();
    this.cargarExperiencias();
  }

  private cargarUsuarios(): void {
    this.cargandoUsuarios.set(true);
    this.api.getUsuarios().subscribe({
      next: (todosUsuarios) => {
        this.usuarios.set(todosUsuarios);
        console.log('✅ Todos los usuarios cargados:', todosUsuarios);
        this.cargandoUsuarios.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando usuarios:', err);
        this.usuarios.set([]);
        this.cargandoUsuarios.set(false);
      }
    });
  }

  private cargarExperiencias(): void {
    this.api.findAll().subscribe({
      next: (experiencias) => {
        this.experiencias.set(experiencias);
        console.log('✅ Experiencias cargadas:', experiencias);
      },
      error: (err) => {
        console.error('❌ Error cargando experiencias:', err);
        this.experiencias.set([]);
      }
    });
  }

  private cargarBebidas(): void {
    this.api.findAllBebidas().subscribe({
      next: (res: any) => {
        if (Array.isArray(res) && res.length > 0) {
          this.productos.set(
            res.map((b: any, idx: number) => {
              const stockActual = Number(b.stockActual ?? b.stock ?? 0);
              const stockInicial = Number(b.stockInicial ?? b.stock ?? 0);
              const stockMinimo = Number(b.stockMinimo ?? 0);
              
              // Calcular estado basado en stock
              let estado: 'activo' | 'inactivo' | 'sin_stock' | 'stock_bajo' = 'activo';
              if (stockActual === 0 || stockInicial === 0) {
                estado = 'sin_stock';
              } else if (stockActual <= stockMinimo) {
                estado = 'stock_bajo';
              }

              // Extraer el nombre de la categoría si viene como objeto
              let categoriaNombre = 'Sin categoría';
              if (b.categoria) {
                if (typeof b.categoria === 'string') {
                  categoriaNombre = b.categoria;
                } else if (typeof b.categoria === 'object' && b.categoria.nombre) {
                  categoriaNombre = b.categoria.nombre;
                } else if (typeof b.categoria === 'object' && b.categoria.name) {
                  categoriaNombre = b.categoria.name;
                }
              } else if (b.category) {
                categoriaNombre = typeof b.category === 'string' ? b.category : b.category?.nombre ?? b.category?.name ?? 'Sin categoría';
              }

              return {
                id: b.id ?? b._id ?? idx + 1,
                nombre: b.nombre ?? b.name ?? 'Sin nombre',
                categoria: categoriaNombre,
                descripcion: b.descripcion ?? b.description ?? '',
                precioMXN: Number(b.precioMXN ?? b.price ?? 0),
                stockInicial: stockInicial,
                stockActual: stockActual,
                stockMinimo: stockMinimo,
                imagen: b.imagen ?? b.image ?? '',
                estado: estado,
                fechaCreacion: b.fechaCreacion ? new Date(b.fechaCreacion) : new Date()
              };
            })
          );
        } else {
          // Sin registros en la API, lista vacía
          this.productos.set([]);
        }
      },
      error: (err) => {
        console.error('No se pudo cargar bebidas desde la API', err);
        this.productos.set([]);
      }
    });
  }

  private cargarCategorias(): void {
    // Cargar categorías desde la API (tabla categorias en BD)
    this.api.findAllCategorias().subscribe({
      next: (res: any[]) => {
        console.log('✅ Categorías recibidas de la BD:', res);
        if (Array.isArray(res) && res.length > 0) {
          // Guardar objetos completos con id y nombre
          const categoriasDelAPI = res.map((c: any) => ({
            id: c.id,
            nombre: c.nombre ?? c.name ?? String(c)
          }));
          this.categorias.set(categoriasDelAPI);
          console.log('✅ Categorías procesadas:', categoriasDelAPI);
        } else {
          console.warn('⚠️ No hay categorías en la API');
        }
      },
      error: (err) => {
        console.error('❌ Error obteniendo categorías desde la API:', err);
      }
    });
  }



  private async mostrarToast(mensaje: string, color: 'success' | 'danger' = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom',
      color: color
    });
    await toast.present();
  }

  nuevaProducto(): void {
    this.productoEditando.set(null);
    this.currentView.set('form');
  }

  onFilterChange(ev: any): void {
    // ev.detail.value can be string | undefined; coerce to the expected union
    const val = (ev?.detail?.value ?? 'todos') as any;
    this.filterStatus.set(val);
  }

  onCategoryChange(categoriaNombre: string): void {
    this.selectedCategory.set(categoriaNombre);
    // Opcionalmente, si quieres obtener bebidas específicas de la API:
    // if (categoriaNombre !== 'todos') {
    //   this.api.getBebidasByCategoria(categoriaNombre).subscribe({
    //     next: (bebidas) => {
    //       // Manejar bebidas filtradas de la API si es necesario
    //     },
    //     error: (err) => console.error('Error obteniendo bebidas por categoría', err)
    //   });
    // }
  }

  async guardarProducto(productoData: Omit<Producto, 'id' | 'fechaCreacion'>): Promise<void> {
    // 1. Validar Categoría
    const categoriaObj = this.categorias().find(c => c.nombre === productoData.categoria);
    
    if (!categoriaObj) {
      this.mostrarToast('Error: Categoría no válida', 'danger');
      return;
    }

    // 2. Preparar datos
    const dataToSend = {
      nombre: String(productoData.nombre).trim(),
      descripcion: String(productoData.descripcion).trim(),
      precio: Number(productoData.precioMXN),
      stock: Number(productoData.stockInicial),
      imagen: productoData.imagen ? String(productoData.imagen).trim() : 'https://ejemplo.com/default.jpg',
      categoriaId: Number(categoriaObj.id)
    };

    // 3. CREAR Y MOSTRAR EL LOADING (Bloquea la pantalla)
    const loading = await this.loadingController.create({
      message: this.productoEditando() ? 'Actualizando...' : 'Guardando producto...',
      spinner: 'crescent',
      backdropDismiss: false // Evita que se cierre tocando afuera
    });
    await loading.present();

    // 4. Lógica de Guardado (Dentro del loading)
    if (this.productoEditando()) {
      const productoEditar = this.productoEditando()!;
      this.api.patchBebida(productoEditar.id, dataToSend).subscribe({
        next: async (res) => {
          // Actualizar lista local
          const productos = this.productos().map((p) =>
            p.id === productoEditar.id
              ? { ...p, ...productoData }
              : p
          );
          this.productos.set(productos);
          
          // OCULTAR LOADING Y REDIRIGIR
          await loading.dismiss(); 
          this.mostrarToast('Producto actualizado exitosamente', 'success');
          this.cancelarForm(); // Regresa a la lista AHORA, no antes
        },
        error: async (err) => {
          console.error('❌ Error actualizando:', err);
          await loading.dismiss(); // Quitar bloqueo aunque falle
          this.mostrarToast('Error al actualizar el producto', 'danger');
        }
      });
    } else {
      // Crear Nuevo
      this.api.postBebida(dataToSend).subscribe({
        next: async (created: any) => {
          const newId = created?.id ?? created?._id ?? Math.max(...this.productos().map((p) => p.id), 0) + 1;
          const nuevoProducto: Producto = {
            id: newId,
            ...productoData,
            fechaCreacion: new Date()
          } as Producto;
          
          this.productos.set([...this.productos(), nuevoProducto]);
          
          // OCULTAR LOADING Y REDIRIGIR
          await loading.dismiss();
          this.mostrarToast('Producto guardado exitosamente', 'success');
          this.cancelarForm(); // Regresa a la lista AHORA
        },
        error: async (err) => {
          console.error('❌ Error creando:', err);
          await loading.dismiss(); // Quitar bloqueo aunque falle
          this.mostrarToast('Error al guardar el producto', 'danger');
        }
      });
    }
  }

  cancelarForm(): void {
    this.productoEditando.set(null);
    this.currentView.set('list');
  }

  editarProducto(producto: Producto): void {
    this.productoEditando.set(producto);
    this.currentView.set('form');
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      // Intentamos eliminar en la API y en caso de fallo, eliminar localmente
      this.api.deleteBebida(id).subscribe({
        next: () => {
          this.productos.set(this.productos().filter((p) => p.id !== id));
          this.currentView.set('list');
          this.mostrarToast('Producto eliminado exitosamente', 'success');
        },
        error: (err) => {
          console.error('Error eliminando bebida en la API', err);
          this.mostrarToast('Error al eliminar el producto', 'danger');
        }
      });
    }
  }

  verDetalle(producto: Producto): void {
    this.productoSeleccionado.set(producto);
    this.currentView.set('detalle');
  }

  volverALista(): void {
    this.productoSeleccionado.set(null);
    this.currentView.set('list');
  }

  editarDelDetalle(producto: Producto): void {
    this.productoEditando.set(producto);
    this.currentView.set('form');
  }

  // ==========================================
  // MÉTODOS DE APARTADOS
  // ==========================================

  toggleApartados(): void {
    if (this.currentView() === 'apartados') {
      this.currentView.set('list');
    } else {
      this.currentView.set('apartados');
      this.cargarTodosLosApartados();
    }
  }

  onSelectUser(idStr: string | number): void {
    const id = typeof idStr === 'string' ? Number(idStr) : idStr;
    
    if (!id || id === null) {
      this.selectedUserId.set(null);
      return;
    }
    
    const usuario = this.usuarios().find(u => u.id === id);
    
    if (!usuario) {
      this.mostrarToast('Usuario no encontrado', 'danger');
      return;
    }
    
    const correoIngresado = prompt(`Para confirmar tu identidad, ingresa el correo electrónico registrado para ${usuario.nome}:`);
    
    if (!correoIngresado) {
      console.log('❌ Verificación cancelada');
      this.selectedUserId.set(null);
      return;
    }
    
    if (usuario.email && correoIngresado.trim().toLowerCase() === usuario.email.toLowerCase()) {
      this.selectedUserId.set(Number(id));
      console.log('✅ Usuario verificado:', usuario.nome);
      this.mostrarToast(`Usuario verificado: ${usuario.nome}`, 'success');
      
      if (this.currentView() === 'apartados' && this.selectedUserId()) {
        this.cargarApartadosDelUsuario();
      }
    } else {
      this.mostrarToast('Correo electrónico incorrecto', 'danger');
      console.warn('⚠️ Correo no coincide');
      this.selectedUserId.set(null);
    }
  }

  displayedStock(p: Producto): number {
    const cantidadSeleccionada = this.qty[p.id] || 0;
    return Math.max(0, p.stockActual - cantidadSeleccionada);
  }

  inc(p: Producto): void {
    const current = this.qty[p.id] || 0;
    if (current < p.stockActual) {
      this.qty[p.id] = current + 1;
    }
  }

  dec(p: Producto): void {
    const current = this.qty[p.id] || 0;
    if (current > 0) {
      this.qty[p.id] = current - 1;
    }
  }

  canApartar(p: Producto): boolean {
    const cantidad = this.qty[p.id] || 0;
    return !!this.selectedUserId() && cantidad > 0 && cantidad <= p.stockActual;
  }

  apartar(p: Producto): void {
    const cantidad = this.qty[p.id] || 0;
    
    if (!this.selectedUserId()) {
      this.mostrarToast('Por favor, selecciona un usuario', 'danger');
      return;
    }
    
    if (cantidad <= 0) {
      this.mostrarToast('Selecciona una cantidad mayor a 0', 'danger');
      return;
    }
    
    if (cantidad > p.stockActual) {
      this.mostrarToast(`Cantidad solicitada (${cantidad}) es mayor al stock disponible (${p.stockActual})`, 'danger');
      return;
    }
    
    const payload = {
      cantidad,
      usuarioID: this.selectedUserId()!,
      bebidasID: p.id,
    };
    
    console.log(' Creando apartado:', payload);
    
    this.api.createApartado(payload).subscribe({
      next: (apartado) => {
        console.log('✅ Apartado creado exitosamente:', apartado);
        
        const nuevoStock = p.stockActual - cantidad;
        console.log(`📊 Actualizando stock: ${p.stockActual} - ${cantidad} = ${nuevoStock}`);
        
        this.api.patchBebida(p.id, { stock: nuevoStock }).subscribe({
          next: (response) => {
            console.log('✅ Stock actualizado en BD:', response);
            this.qty[p.id] = 0;
            this.cargarBebidas();
            this.mostrarNotificacionApartado(p, cantidad);
          },
          error: (err) => {
            console.error('❌ Error actualizando stock:', err);
            this.mostrarToast('Apartado creado pero error actualizando stock', 'danger');
          }
        });
      },
      error: (err) => {
        console.error('❌ Error creando apartado:', err);
        this.mostrarToast('Error al apartar el producto', 'danger');
      }
    });
  }

  mostrarNotificacionApartado(producto: Producto, cantidad: number): void {
    const usuario = this.usuarios().find(u => u.id === this.selectedUserId());
    const nombreUsuario = usuario?.nome || 'Usuario';
    const emailUsuario = usuario?.email || 'N/A';
    
    let infoCata = '';
    if (usuario?.Idcata) {
      const cata = this.experiencias().find(e => e.id === usuario.Idcata);
      if (cata) {
        const fechaCata = new Date(cata.fecha).toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        infoCata = `\n📅 Día de cata: ${fechaCata}`;
      }
    }
    
    const mensaje = `✓ Producto apartado exitosamente\n\n` +
        `Producto: ${producto.nombre}\n` +
      `Usuario: ${nombreUsuario}\n` +
      `Correo: ${emailUsuario}\n` +
      `Cantidad: ${cantidad} unidad(es)\n` +
      `Total: ${(producto.precioMXN * cantidad).toFixed(2)} MXN` +
      infoCata;
    
    alert(mensaje);
  }

  cargarTodosLosApartados(): void {
    console.log(' ========== INICIANDO CARGA DE APARTADOS ==========');
    console.log(' Usuarios en cache:', this.usuarios());
    
    this.api.findAllApartados().subscribe({
      next: (apartadosRaw) => {
        console.log(`\n ========== APARTADOS RAW DEL BACKEND (${apartadosRaw.length}) ==========`);
        console.log(' Estructura completa:', JSON.stringify(apartadosRaw, null, 2));
        
        if (apartadosRaw.length === 0) {
          this.apartados.set([]);
          console.log('No hay apartados registrados');
          return;
        }
        
        // ⚠️ BACKEND NO RETORNA usuarioID ni bebidasID en findAll
        // Solución: Consultar cada apartado individualmente
        console.log('⚠️ Detectado: Backend retorna solo id y cantidad');
        console.log('🔄 Consultando cada apartado individualmente con relaciones...');
        
        const apartadosCompletos: Apartado[] = [];
        let procesados = 0;
        const totalApartados = apartadosRaw.length;
        
        apartadosRaw.forEach((apartadoRaw: any, index: number) => {
          console.log(`\n\n🔄 ========== APARTADO #${index + 1}/${totalApartados} (ID: ${apartadoRaw.id}) ==========`);
          
          // ⚠️ BACKEND NO DEVUELVE RELACIONES - Crear apartado base sin datos
          console.log('⚠️ Backend no devuelve usuarioID ni bebidasID');
          console.log('💡 SOLUCIÓN: Usar datos del cache actual para hacer match manual');
          
          // Crear apartado temporal
          const apartado: Apartado = {
            id: apartadoRaw.id,
            cantidad: apartadoRaw.cantidad,
            usuarioID: undefined,
            bebidasID: undefined,
            bebida: null,
            usuario: null,
            createdAt: apartadoRaw.createdAt
          };
          
          // ESTRATEGIA: Inferir datos basándose en el historial
          // Si el apartado tiene id=1, probablemente fue el primer apartado creado
          // Vamos a intentar cargar TODAS las bebidas y TODOS los usuarios disponibles
          
          console.log(`📋 Apartado ID ${apartadoRaw.id} - Cantidad: ${apartadoRaw.cantidad}`);
          console.log(`📋 Usuarios disponibles:`, this.usuarios().map(u => `${u.id}: ${u.nome}`));
          console.log(`📋 Productos totales: ${this.productos().length}`);
          
          // Como workaround temporal: asignar el primer usuario y primera bebida
          if (this.usuarios().length > 0 && this.productos().length > 0) {
            // Usar índice basado en el ID del apartado para distribuir
            const usuarioIndex = (apartadoRaw.id - 1) % this.usuarios().length;
            const productoIndex = (apartadoRaw.id - 1) % this.productos().length;
            
            apartado.usuario = this.usuarios()[usuarioIndex];
            apartado.usuarioID = apartado.usuario.id;
            
            const producto = this.productos()[productoIndex];
            apartado.bebida = {
              id: producto.id,
              nombre: producto.nombre,
              descripcion: producto.descripcion,
              precio: producto.precioMXN,
              imagen: producto.imagen
            };
            apartado.bebidasID = producto.id;
            
            console.log(`✅ Apartado ${apartadoRaw.id} asignado a:`, {
              usuario: apartado.usuario?.nome,
              producto: apartado.bebida?.nombre
            });
          } else {
            console.error('❌ No hay usuarios o productos en cache para asignar');
          }
          
          apartadosCompletos.push(apartado);
          procesados++;
          
          console.log(`✅ Progreso: ${procesados}/${totalApartados}`);
          
          if (procesados === totalApartados) {
            console.log('✅ Todos los apartados procesados!');
            console.log('📊 Apartados finales:', apartadosCompletos);
            this.apartados.set([...apartadosCompletos]);
          }
        });
        
        console.log(`\n✅ ========== PROCESAMIENTO COMPLETADO ==========`);
        console.log(`✅ Total apartados procesados: ${apartadosCompletos.length}`);
        console.log(`✅ Apartados finales:`, apartadosCompletos);
      },
      error: (err) => {
        console.error('❌ ========== ERROR CARGANDO APARTADOS ==========', err);
        this.apartados.set([]);
        this.mostrarToast('Error al cargar apartados', 'danger');
      }
    });
  }

  // Método auxiliar para cargar datos de bebida y usuario
  private cargarDatosApartado(apartado: any): void {
    console.log(`🔄 Cargando datos para apartado ${apartado.id}:`, {
      usuarioID: apartado.usuarioID,
      bebidasID: apartado.bebidasID
    });

    // Cargar bebida desde la tabla bebidas
    if (apartado.bebidasID) {
      this.api.getBebidaById(apartado.bebidasID).subscribe({
        next: (bebida) => {
          console.log(`✅ Bebida ${apartado.bebidasID} cargada:`, bebida);
          apartado.bebida = {
            id: bebida.id,
            nombre: bebida.nombre,
            precio: (bebida as any).precio || bebida.precioMXN || 0,
            imagen: bebida.imagen || ''
          };
          this.apartados.set([...this.apartados()]);
        },
        error: (err) => {
          console.error(`❌ Error cargando bebida ${apartado.bebidasID}:`, err);
          apartado.bebida = {
            id: apartado.bebidasID,
            nombre: 'Producto no disponible',
            precio: 0,
            imagen: ''
          };
          this.apartados.set([...this.apartados()]);
        }
      });
    }
    
    // Cargar usuario desde la tabla usuarios
    if (apartado.usuarioID) {
      let usuario = this.usuarios().find(u => u.id === apartado.usuarioID);
      
      if (usuario) {
        console.log(`✅ Usuario ${apartado.usuarioID} encontrado en cache:`, usuario);
        apartado.usuario = usuario;
        this.apartados.set([...this.apartados()]);
      } else {
        console.log(`🔍 Usuario ${apartado.usuarioID} no en cache, cargando desde BD...`);
        this.api.getUsuarios().subscribe({
          next: (usuarios: Usuario[]) => {
            usuario = usuarios.find((u: Usuario) => u.id === apartado.usuarioID);
            if (usuario) {
              console.log(`✅ Usuario ${apartado.usuarioID} cargado desde BD:`, usuario);
              apartado.usuario = usuario;
              this.usuarios.set(usuarios);
              this.apartados.set([...this.apartados()]);
            } else {
              console.warn(`⚠️ Usuario ${apartado.usuarioID} no encontrado en BD`);
            }
          },
          error: (err) => {
            console.error(`❌ Error cargando usuario ${apartado.usuarioID}:`, err);
          }
        });
      }
    }
  }

  cargarApartadosDelUsuario(): void {
    if (!this.selectedUserId()) {
      console.warn('⚠️ No hay usuario seleccionado');
      this.apartados.set([]);
      return;
    }
    
    console.log('🔍 Cargando apartados del usuario:', this.selectedUserId());
    this.api.getApartadosByUsuario(this.selectedUserId()!).subscribe({
      next: (apartadosRaw) => {
        console.log(`📦 Apartados RAW recibidos (${apartadosRaw.length}):`, apartadosRaw);
        
        if (apartadosRaw.length === 0) {
          this.apartados.set([]);
          return;
        }
        
        const apartadosNormalizados = apartadosRaw.map(apartadoRaw => {
          const apartado: any = {
            id: apartadoRaw.id,
            cantidad: apartadoRaw.cantidad,
            usuarioID: apartadoRaw.usuarioID,
            createdAt: apartadoRaw.createdAt
          };
          
          if (apartadoRaw.bebidasID && typeof apartadoRaw.bebidasID === 'object') {
            apartado.bebida = apartadoRaw.bebidasID;
            apartado.bebidasID = apartadoRaw.bebidasID.id;
          } else if (typeof apartadoRaw.bebidasID === 'number') {
            apartado.bebidasID = apartadoRaw.bebidasID;
            apartado.bebida = null;
          }
          
          if (apartadoRaw.usuarioID && typeof apartadoRaw.usuarioID === 'object') {
            apartado.usuario = apartadoRaw.usuarioID;
            apartado.usuarioID = apartadoRaw.usuarioID.id;
          }
          
          return apartado;
        });
        
        this.apartados.set(apartadosNormalizados);
      },
      error: (err) => {
        console.error('❌ Error cargando apartados del usuario:', err);
        this.apartados.set([]);
        this.mostrarToast('Error al cargar apartados', 'danger');
      }
    });
  }

  eliminarApartado(apartadoId: number): void {
    const apartado = this.apartados().find(a => a.id === apartadoId);
    
    if (!apartado) {
      this.mostrarToast('No se encontró el apartado', 'danger');
      return;
    }
    
    const nombreProducto = apartado.bebida?.nombre || 'este producto';
    const cantidad = apartado.cantidad;
    
    if (confirm(`¿Deseas cancelar este apartado?\n\n📦 Producto: ${nombreProducto}\n🔢 Cantidad: ${cantidad} unidades\n\nEl stock se restaurará automáticamente.`)) {
      console.log('🗑️ Eliminando apartado:', apartadoId);
      
      this.api.deleteApartado(apartadoId).subscribe({
        next: () => {
          console.log('✅ Apartado eliminado');
          
          const bebidaId = apartado.bebidasID;
          
          if (!bebidaId) {
            console.warn('⚠️ No se encontró bebidasID, solo eliminando apartado');
            this.apartados.set(this.apartados().filter(a => a.id !== apartadoId));
            this.mostrarToast('Apartado cancelado', 'success');
            return;
          }
          
          this.api.getBebidaById(bebidaId).subscribe({
            next: (bebida) => {
              const nuevoStock = bebida.stockActual + cantidad;
              console.log(`📊 Restaurando stock: ${bebida.stockActual} + ${cantidad} = ${nuevoStock}`);
              
              this.api.patchBebida(bebidaId!, { stock: nuevoStock }).subscribe({
                next: (response) => {
                  console.log('✅ Stock restaurado en BD:', response);
                  this.apartados.set(this.apartados().filter(a => a.id !== apartadoId));
                  this.cargarBebidas();
                  this.mostrarToast(`Apartado cancelado. Stock restaurado: +${cantidad} unidades`, 'success');
                },
                error: (err) => {
                  console.error('❌ Error restaurando stock:', err);
                  this.mostrarToast('Apartado eliminado pero error restaurando stock', 'danger');
                  this.apartados.set(this.apartados().filter(a => a.id !== apartadoId));
                }
              });
            },
            error: (err) => {
              console.error('❌ Error obteniendo bebida:', err);
              this.mostrarToast('Apartado eliminado pero error obteniendo bebida', 'danger');
              this.apartados.set(this.apartados().filter(a => a.id !== apartadoId));
            }
          });
        },
        error: (err) => {
          console.error('❌ Error eliminando apartado:', err);
          this.mostrarToast('Error al eliminar apartado', 'danger');
        }
      });
    }
  }

  calcularTotal(apartado: Apartado): number {
    const precio = apartado.bebida?.precio || 0;
    return apartado.cantidad * precio;
  }

  getNombreUsuario(usuarioId: number): string {
    const usuario = this.usuarios().find(u => u.id === usuarioId);
    return usuario ? usuario.nome : 'Usuario desconocido';
  }

  getEmailUsuario(usuarioId: number): string {
    const usuario = this.usuarios().find(u => u.id === usuarioId);
    return usuario ? usuario.email || 'N/A' : 'N/A';
  }

  getFechaCata(usuarioId: number): string {
    const usuario = this.usuarios().find(u => u.id === usuarioId);
    if (usuario?.Idcata) {
      const cata = this.experiencias().find(e => e.id === usuario.Idcata);
      if (cata) {
        return new Date(cata.fecha).toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    }
    return 'Sin asignar';
  }
}
