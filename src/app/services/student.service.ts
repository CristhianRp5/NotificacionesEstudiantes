import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError, map, of } from 'rxjs';

// Definir una constante para la URL de la API
const API_URL = 'http://localhost:3000/api';

export interface Student {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  document?: string; // Número de documento del estudiante
  status: 'active' | 'pending' | 'suspended';
  paymentsPending: Array<{
    type: string;  // 'payment' | 'document'
    amount?: number;
    description?: string;
    dueDate?: Date;
    _id?: string;
  }>;
  notifications?: Array<{
    date: Date;
    message: string;
    type: string;
    read: boolean;
  }>;
}

export interface StudentResponse {
  ok?: boolean;
  of?: boolean; // Para la respuesta alternativa del backend
  message?: string;
  students?: Student[];
  student?: Student;
  newStudent?: Student; // Para la respuesta de createStudent
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) {
    console.log('StudentService inicializado. API URL:', API_URL);
  }

  // Obtener todos los estudiantes
  getStudents(): Observable<StudentResponse> {
    console.log(`Solicitando estudiantes a: ${API_URL}/getStudents`);
    return this.http.get<StudentResponse>(`${API_URL}/getStudents`)
      .pipe(
        tap(response => {
          console.log('Respuesta recibida de getStudents:', response);
          if (response.ok) {
            console.log(`Se obtuvieron ${response.students?.length || 0} estudiantes`);
          } else {
            console.warn('La respuesta no fue exitosa:', response.message);
          }
        }),
        catchError(this.handleError('getStudents'))
      );
  }

  // Obtener un estudiante por ID
  getStudentById(id: string): Observable<StudentResponse> {
    console.log(`Solicitando estudiante con ID ${id} a: ${API_URL}/getStudentById/${id}`);
    return this.http.get<StudentResponse>(`${API_URL}/getStudentById/${id}`)
      .pipe(
        tap(response => {
          console.log('Respuesta recibida de getStudentById:', response);
          if (response.ok) {
            console.log('Estudiante obtenido:', response.student);
          } else {
            console.warn(`No se pudo obtener el estudiante con ID ${id}:`, response.message);
          }
        }),
        catchError(this.handleError('getStudentById'))
      );
  }

  // Buscar estudiante por número de documento
  // Solución alternativa: buscar en todos los estudiantes filtrando por documento
  getStudentByDocument(document: string): Observable<StudentResponse> {
    console.log(`Buscando estudiante con documento ${document} usando método alternativo`);

    // Obtener todos los estudiantes y filtrar por documento
    return this.getStudents().pipe(
      map(response => {
        if (!response.ok || !response.students || response.students.length === 0) {
          console.warn('No se pudieron obtener estudiantes para buscar por documento');
          return {
            ok: false,
            message: 'No se pudieron obtener estudiantes para buscar por documento'
          };
        }

        // Filtrar estudiantes por documento
        const foundStudent = response.students.find(
          student => student.document === document ||
                    student._id === document ||   // Búsqueda por ID como alternativa
                    student.phone === document || // Búsqueda por teléfono como alternativa
                    student.email === document    // Búsqueda por email como alternativa
        );

        if (foundStudent) {
          console.log('Estudiante encontrado por documento:', foundStudent);
          return {
            ok: true,
            student: foundStudent
          };
        } else {
          console.warn(`No se encontró ningún estudiante con documento/id/teléfono/email: ${document}`);
          return {
            ok: false,
            message: `No se encontró ningún estudiante con documento: ${document}`
          };
        }
      }),
      catchError(this.handleError('getStudentByDocument'))
    );
  }

  // Crear un nuevo estudiante
  createStudent(student: Student): Observable<StudentResponse> {
    console.log(`Creando nuevo estudiante en: ${API_URL}/createStudent`, student);
    return this.http.post<StudentResponse>(`${API_URL}/createStudent`, student)
      .pipe(
        tap(response => {
          console.log('Respuesta recibida de createStudent:', response);
        }),
        map(response => {
          // Convertir la respuesta del backend al formato esperado
          const standardResponse: StudentResponse = {
            ok: response.of, // Usar 'of' como indicador de éxito
            message: response.message,
            student: response.newStudent // Usar newStudent para el estudiante creado
          };

          if (standardResponse.ok) {
            console.log('Estudiante creado exitosamente');
          } else {
            console.warn('No se pudo crear el estudiante:', standardResponse.message);
          }

          return standardResponse;
        }),
        catchError(this.handleError('createStudent'))
      );
  }

  // Actualizar pagos de un estudiante
  updateStudentPayments(id: string, payments: any): Observable<StudentResponse> {
    console.log(`Actualizando pagos del estudiante ${id} en: ${API_URL}/updatStudent-payments/${id}`, payments);
    return this.http.put<StudentResponse>(`${API_URL}/updatStudent-payments/${id}`, { payments })
      .pipe(
        tap(response => {
          console.log('Respuesta recibida de updateStudentPayments:', response);
          if (response.ok) {
            console.log('Pagos del estudiante actualizados exitosamente');
          } else {
            console.warn(`No se pudieron actualizar los pagos del estudiante ${id}:`, response.message);
          }
        }),
        catchError(this.handleError('updateStudentPayments'))
      );
  }

  // Registrar un pago para un estudiante
  registerPayment(studentId: string, payment: any): Observable<StudentResponse> {
    console.log(`Registrando pago para estudiante ${studentId} en: ${API_URL}/registerPayment/${studentId}`, payment);

    // Descomentar el código para usar el endpoint real
    return this.http.post<StudentResponse>(`${API_URL}/registerPayment/${studentId}`, payment)
      .pipe(
        tap(response => {
          console.log('Respuesta recibida de registerPayment:', response);
          if (response.ok || response.of) {
            console.log('Pago registrado exitosamente');
          } else {
            console.warn(`No se pudo registrar el pago para el estudiante ${studentId}:`, response.message);
          }
        }),
        catchError(this.handleError('registerPayment'))
      );

    /* Código para simulación (comentado)
    console.log('NOTA: Usando simulación de registro de pago ya que el endpoint puede no existir');
    const simulatedResponse: StudentResponse = {
      ok: true,
      message: 'Pago registrado exitosamente (simulado)',
      student: undefined
    };
    return of(simulatedResponse).pipe(delay(800));
    */
  }

  // Obtener estudiantes morosos (filtrado del lado del cliente)
  getMorososStudents(): Observable<StudentResponse> {
    return this.getStudents();
  }

  // Manejador de errores
  private handleError(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`Error en ${operation}:`, error);

      // Mostrar detalles específicos según el tipo de error
      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente (red, etc.)
        console.error(`Error del cliente: ${error.error.message}`);
      } else {
        // Error del lado del servidor
        console.error(`Código de estado: ${error.status}, ` +
                      `Cuerpo: ${JSON.stringify(error.error)}`);
      }

      // Mensaje personalizado para mostrar al usuario
      const message = `Error en la operación ${operation}: ${error.message}`;
      return throwError(() => new Error(message));
    };
  }
}
