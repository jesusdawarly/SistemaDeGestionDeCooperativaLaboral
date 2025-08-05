import React, { useState, useEffect, useRef } from 'react';
import { Users, FileText, CreditCard, DollarSign, BarChart3, Settings, Download, Upload, Eye, Edit, Trash2, Plus, Search, Filter, X, Save, LogOut, Lock } from 'lucide-react';

const CooperativaCruzRoja = () => {
  // Estados principales
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('admin123');
  const [inputPassword, setInputPassword] = useState('');
  const [activeTab, setActiveTab] = useState('socios');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSocio, setSelectedSocio] = useState(null);
  const [reportDateRange, setReportDateRange] = useState({ start: '', end: '' });

  // Estados de datos
  const [socios, setSocios] = useState([]);
  const [certificados, setCertificados] = useState([]);
  const [descuentos, setDescuentos] = useState([]);
  const [pagosExtraordinarios, setPagosExtraordinarios] = useState([]);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedPassword = localStorage.getItem('cruzroja_password');
    if (savedPassword) setPassword(savedPassword);
    
    const savedSocios = localStorage.getItem('cruzroja_socios');
    if (savedSocios) setSocios(JSON.parse(savedSocios));
    
    const savedCertificados = localStorage.getItem('cruzroja_certificados');
    if (savedCertificados) setCertificados(JSON.parse(savedCertificados));
    
    const savedDescuentos = localStorage.getItem('cruzroja_descuentos');
    if (savedDescuentos) setDescuentos(JSON.parse(savedDescuentos));
    
    const savedPagos = localStorage.getItem('cruzroja_pagos');
    if (savedPagos) setPagosExtraordinarios(JSON.parse(savedPagos));
  }, []);

  // Guardar datos en localStorage
  const saveToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Autenticación
  const handleLogin = () => {
    if (inputPassword === password) {
      setIsAuthenticated(true);
      setInputPassword('');
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('socios');
  };

  // Funciones para socios
  const addSocio = (socioData) => {
    const newSocio = {
      id: Date.now(),
      ...socioData,
      fechaIngreso: socioData.fechaIngreso || new Date().toISOString().split('T')[0],
      estado: socioData.estado || 'activo'
    };
    const updatedSocios = [...socios, newSocio];
    setSocios(updatedSocios);
    saveToStorage('cruzroja_socios', updatedSocios);
  };

  const updateSocio = (id, socioData) => {
    const updatedSocios = socios.map(s => s.id === id ? { ...s, ...socioData } : s);
    setSocios(updatedSocios);
    saveToStorage('cruzroja_socios', updatedSocios);
  };

  const deleteSocio = (id) => {
    if (confirm('¿Está seguro de eliminar este socio?')) {
      const updatedSocios = socios.filter(s => s.id !== id);
      setSocios(updatedSocios);
      saveToStorage('cruzroja_socios', updatedSocios);
    }
  };

  // Funciones para certificados
  const addCertificado = (certificadoData) => {
    const newCertificado = {
      id: Date.now(),
      ...certificadoData,
      fecha: certificadoData.fecha || new Date().toISOString().split('T')[0]
    };
    const updatedCertificados = [...certificados, newCertificado];
    setCertificados(updatedCertificados);
    saveToStorage('cruzroja_certificados', updatedCertificados);
  };

  // Funciones para descuentos
  const addDescuento = (descuentoData) => {
    const newDescuento = {
      id: Date.now(),
      ...descuentoData,
      fecha: descuentoData.fecha || new Date().toISOString().split('T')[0]
    };
    const updatedDescuentos = [...descuentos, newDescuento];
    setDescuentos(updatedDescuentos);
    saveToStorage('cruzroja_descuentos', updatedDescuentos);
  };

  // Funciones para pagos extraordinarios
  const addPagoExtraordinario = (pagoData) => {
    const newPago = {
      id: Date.now(),
      ...pagoData,
      fecha: pagoData.fecha || new Date().toISOString().split('T')[0],
      tipo: pagoData.concepto?.toLowerCase().includes('retiro') || pagoData.concepto?.toLowerCase().includes('préstamo') ? 'egreso' : 'ingreso'
    };
    const updatedPagos = [...pagosExtraordinarios, newPago];
    setPagosExtraordinarios(updatedPagos);
    saveToStorage('cruzroja_pagos', updatedPagos);
  };

  // Función para generar PDF
  const generatePDF = (type, data) => {
    const printWindow = window.open('', '_blank');
    let content = '';
    
    const header = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #C8102E; margin: 0;">CRUZ ROJA DOMINICANA</h1>
        <h2 style="color: #666; margin: 10px 0;">Cooperativa Laboral</h2>
        <p style="margin: 5px 0;">Fecha de emisión: ${new Date().toLocaleDateString()}</p>
      </div>
    `;
    
    const footer = `
      <div style="text-align: center; margin-top: 50px; font-size: 12px; color: #666;">
        <p>POWERED BY DSF · DAWARLY SOFTWARE DE GESTIÓN PRESUPUESTARIA</p>
      </div>
    `;

    if (type === 'certificado') {
      const socio = socios.find(s => s.id === data.socioId);
      content = `
        <h3>CERTIFICADO DE APORTACIÓN</h3>
        <p><strong>Socio:</strong> ${socio?.nombre}</p>
        <p><strong>Cédula:</strong> ${socio?.cedula}</p>
        <p><strong>Monto:</strong> RD$ ${Number(data.monto).toLocaleString()}</p>
        <p><strong>Tipo:</strong> ${data.tipo}</p>
        <p><strong>Fecha:</strong> ${data.fecha}</p>
      `;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${type === 'certificado' ? 'Certificado de Aportación' : 'Reporte'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            h1, h2, h3 { color: #C8102E; }
          </style>
        </head>
        <body>
          ${header}
          ${content}
          ${footer}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Función para exportar backup
  const exportBackup = () => {
    const backupData = {
      socios,
      certificados,
      descuentos,
      pagosExtraordinarios,
      fecha: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_cooperativa_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  // Función para importar backup
  const importBackup = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const backupData = JSON.parse(e.target.result);
          if (confirm('¿Está seguro de restaurar este backup? Se perderán los datos actuales.')) {
            setSocios(backupData.socios || []);
            setCertificados(backupData.certificados || []);
            setDescuentos(backupData.descuentos || []);
            setPagosExtraordinarios(backupData.pagosExtraordinarios || []);
            
            saveToStorage('cruzroja_socios', backupData.socios || []);
            saveToStorage('cruzroja_certificados', backupData.certificados || []);
            saveToStorage('cruzroja_descuentos', backupData.descuentos || []);
            saveToStorage('cruzroja_pagos', backupData.pagosExtraordinarios || []);
            
            alert('Backup restaurado exitosamente');
          }
        } catch (error) {
          alert('Error al leer el archivo de backup');
        }
      };
      reader.readAsText(file);
    }
  };

  // Componente Modal
  const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  // Formulario de Socio
  const SocioForm = () => {
    const [formData, setFormData] = useState(editingItem || {
      nombre: '', cedula: '', cargo: '', departamento: '', fechaIngreso: '', estado: 'activo'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (editingItem) {
        updateSocio(editingItem.id, formData);
      } else {
        addSocio(formData);
      }
      setShowModal(false);
      setEditingItem(null);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre completo"
          value={formData.nombre}
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Cédula"
          value={formData.cedula}
          onChange={(e) => setFormData({...formData, cedula: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Cargo"
          value={formData.cargo}
          onChange={(e) => setFormData({...formData, cargo: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Departamento"
          value={formData.departamento}
          onChange={(e) => setFormData({...formData, departamento: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          value={formData.fechaIngreso}
          onChange={(e) => setFormData({...formData, fechaIngreso: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={formData.estado}
          onChange={(e) => setFormData({...formData, estado: e.target.value})}
          className="w-full p-2 border rounded"
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700">
            <Save size={16} className="inline mr-1" />
            {editingItem ? 'Actualizar' : 'Guardar'}
          </button>
          <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
            Cancelar
          </button>
        </div>
      </form>
    );
  };

  // Formulario de Certificado
  const CertificadoForm = () => {
    const [formData, setFormData] = useState({
      socioId: '', monto: '', tipo: 'aportación inicial', fecha: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      addCertificado(formData);
      setShowModal(false);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={formData.socioId}
          onChange={(e) => setFormData({...formData, socioId: parseInt(e.target.value)})}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Seleccionar socio</option>
          {socios.filter(s => s.estado === 'activo').map(socio => (
            <option key={socio.id} value={socio.id}>{socio.nombre} - {socio.cedula}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Monto"
          value={formData.monto}
          onChange={(e) => setFormData({...formData, monto: e.target.value})}
          className="w-full p-2 border rounded"
          required
          step="0.01"
        />
        <select
          value={formData.tipo}
          onChange={(e) => setFormData({...formData, tipo: e.target.value})}
          className="w-full p-2 border rounded"
        >
          <option value="aportación inicial">Aportación inicial</option>
          <option value="aporte mensual">Aporte mensual</option>
          <option value="aporte extraordinario">Aporte extraordinario</option>
        </select>
        <input
          type="date"
          value={formData.fecha}
          onChange={(e) => setFormData({...formData, fecha: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700">
            <Save size={16} className="inline mr-1" />
            Guardar
          </button>
          <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
            Cancelar
          </button>
        </div>
      </form>
    );
  };

  // Formulario de Descuento
  const DescuentoForm = () => {
    const [formData, setFormData] = useState({
      socioId: '', monto: '', concepto: '', fecha: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      addDescuento(formData);
      setShowModal(false);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={formData.socioId}
          onChange={(e) => setFormData({...formData, socioId: parseInt(e.target.value)})}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Seleccionar socio</option>
          {socios.filter(s => s.estado === 'activo').map(socio => (
            <option key={socio.id} value={socio.id}>{socio.nombre} - {socio.cedula}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Monto"
          value={formData.monto}
          onChange={(e) => setFormData({...formData, monto: e.target.value})}
          className="w-full p-2 border rounded"
          required
          step="0.01"
        />
        <input
          type="text"
          placeholder="Concepto"
          value={formData.concepto}
          onChange={(e) => setFormData({...formData, concepto: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          value={formData.fecha}
          onChange={(e) => setFormData({...formData, fecha: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700">
            <Save size={16} className="inline mr-1" />
            Guardar
          </button>
          <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
            Cancelar
          </button>
        </div>
      </form>
    );
  };

  // Formulario de Pago Extraordinario
  const PagoExtraordinarioForm = () => {
    const [formData, setFormData] = useState({
      socioId: '', monto: '', concepto: '', fecha: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      addPagoExtraordinario(formData);
      setShowModal(false);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={formData.socioId}
          onChange={(e) => setFormData({...formData, socioId: parseInt(e.target.value)})}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Seleccionar socio</option>
          {socios.filter(s => s.estado === 'activo').map(socio => (
            <option key={socio.id} value={socio.id}>{socio.nombre} - {socio.cedula}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Monto"
          value={formData.monto}
          onChange={(e) => setFormData({...formData, monto: e.target.value})}
          className="w-full p-2 border rounded"
          required
          step="0.01"
        />
        <input
          type="text"
          placeholder="Concepto (ej: Aporte voluntario, Retiro, Préstamo)"
          value={formData.concepto}
          onChange={(e) => setFormData({...formData, concepto: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          value={formData.fecha}
          onChange={(e) => setFormData({...formData, fecha: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700">
            <Save size={16} className="inline mr-1" />
            Guardar
          </button>
          <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
            Cancelar
          </button>
        </div>
      </form>
    );
  };

  // Calcular estado financiero de un socio
  const calcularEstadoFinanciero = (socioId) => {
    const totalAportado = certificados
      .filter(c => c.socioId === socioId)
      .reduce((sum, c) => sum + Number(c.monto), 0);
    
    const totalDescontado = descuentos
      .filter(d => d.socioId === socioId)
      .reduce((sum, d) => sum + Number(d.monto), 0);
    
    const pagosIngreso = pagosExtraordinarios
      .filter(p => p.socioId === socioId && p.tipo === 'ingreso')
      .reduce((sum, p) => sum + Number(p.monto), 0);
      
    const pagosEgreso = pagosExtraordinarios
      .filter(p => p.socioId === socioId && p.tipo === 'egreso')
      .reduce((sum, p) => sum + Number(p.monto), 0);

    return {
      totalAportado,
      totalDescontado,
      totalPagosIngreso: pagosIngreso,
      totalPagosEgreso: pagosEgreso,
      balanceNeto: totalAportado + pagosIngreso - totalDescontado - pagosEgreso
    };
  };

  // Pantalla de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-red-600 mb-2">CRUZ ROJA DOMINICANA</h1>
            <h2 className="text-lg text-gray-700">Sistema de Gestión de Cooperativa</h2>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                placeholder="Contraseña"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Ingresar
            </button>
          </div>
          <div className="text-center text-xs text-gray-500 mt-6">
            POWERED BY DSF · DAWARLY SOFTWARE DE GESTIÓN PRESUPUESTARIA
          </div>
        </div>
      </div>
    );
  }

  // Renderizar contenido según tab activo
  const renderContent = () => {
    const filteredSocios = socios.filter(socio =>
      socio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      socio.cedula.includes(searchTerm)
    );

    switch (activeTab) {
      case 'socios':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Gestión de Socios</h2>
              <button
                onClick={() => { setEditingItem(null); setShowModal(true); }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Plus size={16} />
                Nuevo Socio
              </button>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nombre o cédula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cédula</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSocios.map(socio => (
                    <tr key={socio.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{socio.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{socio.cedula}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{socio.cargo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{socio.departamento}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          socio.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {socio.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedSocio(socio)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => { setEditingItem(socio); setShowModal(true); }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteSocio(socio.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'certificados':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Certificados de Aportación</h2>
              <button
                onClick={() => setShowModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Plus size={16} />
                Nuevo Certificado
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Socio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {certificados.map(certificado => {
                    const socio = socios.find(s => s.id === certificado.socioId);
                    return (
                      <tr key={certificado.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {socio ? `${socio.nombre} - ${socio.cedula}` : 'Socio no encontrado'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          RD$ {Number(certificado.monto).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{certificado.tipo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{certificado.fecha}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => generatePDF('certificado', certificado)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <Download size={16} />
                            PDF
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'descuentos':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Descuentos por Nómina</h2>
              <button
                onClick={() => setShowModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Plus size={16} />
                Nuevo Descuento
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Socio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {descuentos.map(descuento => {
                    const socio = socios.find(s => s.id === descuento.socioId);
                    return (
                      <tr key={descuento.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {socio ? `${socio.nombre} - ${socio.cedula}` : 'Socio no encontrado'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          RD$ {Number(descuento.monto).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{descuento.concepto}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{descuento.fecha}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'pagos':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Pagos Extraordinarios</h2>
              <button
                onClick={() => setShowModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Plus size={16} />
                Nuevo Pago
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Socio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pagosExtraordinarios.map(pago => {
                    const socio = socios.find(s => s.id === pago.socioId);
                    return (
                      <tr key={pago.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {socio ? `${socio.nombre} - ${socio.cedula}` : 'Socio no encontrado'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          RD$ {Number(pago.monto).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pago.concepto}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            pago.tipo === 'ingreso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {pago.tipo}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pago.fecha}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'estados':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Estados Financieros de Socios</h2>
            
            <div className="grid gap-6">
              {socios.filter(s => s.estado === 'activo').map(socio => {
                const estado = calcularEstadoFinanciero(socio.id);
                return (
                  <div key={socio.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{socio.nombre}</h3>
                        <p className="text-sm text-gray-500">Cédula: {socio.cedula}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          RD$ {estado.balanceNeto.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">Balance Neto</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <p className="text-lg font-semibold text-blue-600">
                          RD$ {estado.totalAportado.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600">Total Aportado</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded">
                        <p className="text-lg font-semibold text-red-600">
                          RD$ {estado.totalDescontado.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600">Total Descontado</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <p className="text-lg font-semibold text-green-600">
                          RD$ {estado.totalPagosIngreso.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600">Pagos Ingreso</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded">
                        <p className="text-lg font-semibold text-orange-600">
                          RD$ {estado.totalPagosEgreso.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600">Pagos Egreso</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'reportes':
        const currentMonth = new Date().toISOString().slice(0, 7);
        
        const totalAportacionesMes = certificados
          .filter(c => c.fecha.startsWith(currentMonth))
          .reduce((sum, c) => sum + Number(c.monto), 0);
          
        const totalEgresosMes = pagosExtraordinarios
          .filter(p => p.fecha.startsWith(currentMonth) && p.tipo === 'egreso')
          .reduce((sum, p) => sum + Number(p.monto), 0);
          
        const saldoActual = certificados.reduce((sum, c) => sum + Number(c.monto), 0) +
                           pagosExtraordinarios.filter(p => p.tipo === 'ingreso').reduce((sum, p) => sum + Number(p.monto), 0) -
                           descuentos.reduce((sum, d) => sum + Number(d.monto), 0) -
                           pagosExtraordinarios.filter(p => p.tipo === 'egreso').reduce((sum, p) => sum + Number(p.monto), 0);

        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Reportes Generales</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    RD$ {totalAportacionesMes.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Aportaciones del Mes</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">
                    RD$ {totalEgresosMes.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Egresos del Mes</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    RD$ {saldoActual.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Saldo Actual de Caja</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Resumen por Mes Actual</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total de socios activos:</span>
                  <span className="font-semibold">{socios.filter(s => s.estado === 'activo').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Certificados emitidos este mes:</span>
                  <span className="font-semibold">{certificados.filter(c => c.fecha.startsWith(currentMonth)).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Descuentos aplicados este mes:</span>
                  <span className="font-semibold">{descuentos.filter(d => d.fecha.startsWith(currentMonth)).length}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'admin':
        const changePassword = () => {
          const newPassword = prompt('Ingrese la nueva contraseña:');
          if (newPassword && newPassword.length >= 4) {
            setPassword(newPassword);
            localStorage.setItem('cruzroja_password', newPassword);
            alert('Contraseña actualizada exitosamente');
          } else {
            alert('La contraseña debe tener al menos 4 caracteres');
          }
        };

        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Panel Administrativo</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Gestión de Datos</h3>
                <div className="space-y-3">
                  <button
                    onClick={exportBackup}
                    className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Exportar Backup
                  </button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={importBackup}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                      <Upload size={16} />
                      Importar Backup
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Configuración</h3>
                <div className="space-y-3">
                  <button
                    onClick={changePassword}
                    className="w-full bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2"
                  >
                    <Lock size={16} />
                    Cambiar Contraseña
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Estadísticas del Sistema</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded">
                  <p className="text-2xl font-bold text-blue-600">{socios.length}</p>
                  <p className="text-sm text-gray-600">Total Socios</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <p className="text-2xl font-bold text-green-600">{certificados.length}</p>
                  <p className="text-sm text-gray-600">Certificados</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded">
                  <p className="text-2xl font-bold text-red-600">{descuentos.length}</p>
                  <p className="text-sm text-gray-600">Descuentos</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded">
                  <p className="text-2xl font-bold text-purple-600">{pagosExtraordinarios.length}</p>
                  <p className="text-sm text-gray-600">Pagos Extra</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-red-600">CRUZ ROJA DOMINICANA</h1>
              <p className="text-sm text-gray-600">Sistema de Gestión de Cooperativa Laboral</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <LogOut size={16} />
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <nav className="w-64 bg-white rounded-lg shadow p-4">
            <ul className="space-y-2">
              {[
                { id: 'socios', label: 'Socios', icon: Users },
                { id: 'certificados', label: 'Certificados', icon: FileText },
                { id: 'descuentos', label: 'Descuentos', icon: CreditCard },
                { id: 'pagos', label: 'Pagos Extra', icon: DollarSign },
                { id: 'estados', label: 'Estados Financieros', icon: BarChart3 },
                { id: 'reportes', label: 'Reportes', icon: BarChart3 },
                { id: 'admin', label: 'Administración', icon: Settings },
              ].map(tab => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-red-100 text-red-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-500">
            POWERED BY DSF · DAWARLY SOFTWARE DE GESTIÓN PRESUPUESTARIA
          </div>
        </div>
      </footer>

      {/* Modal */}
      {showModal && (
        <Modal
          title={
            activeTab === 'socios' ? (editingItem ? 'Editar Socio' : 'Nuevo Socio') :
            activeTab === 'certificados' ? 'Nuevo Certificado' :
            activeTab === 'descuentos' ? 'Nuevo Descuento' :
            activeTab === 'pagos' ? 'Nuevo Pago Extraordinario' : 'Formulario'
          }
          onClose={() => { setShowModal(false); setEditingItem(null); }}
        >
          {activeTab === 'socios' && <SocioForm />}
          {activeTab === 'certificados' && <CertificadoForm />}
          {activeTab === 'descuentos' && <DescuentoForm />}
          {activeTab === 'pagos' && <PagoExtraordinarioForm />}
        </Modal>
      )}

      {/* Modal de perfil de socio */}
      {selectedSocio && (
        <Modal
          title={`Perfil de ${selectedSocio.nombre}`}
          onClose={() => setSelectedSocio(null)}
        >
          <div className="space-y-4">
            <div>
              <p><strong>Cédula:</strong> {selectedSocio.cedula}</p>
              <p><strong>Cargo:</strong> {selectedSocio.cargo}</p>
              <p><strong>Departamento:</strong> {selectedSocio.departamento}</p>
              <p><strong>Fecha de Ingreso:</strong> {selectedSocio.fechaIngreso}</p>
              <p><strong>Estado:</strong> {selectedSocio.estado}</p>
            </div>
            
            {(() => {
              const estado = calcularEstadoFinanciero(selectedSocio.id);
              return (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Estado Financiero</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Total Aportado: <span className="font-semibold">RD$ {estado.totalAportado.toLocaleString()}</span></div>
                    <div>Total Descontado: <span className="font-semibold">RD$ {estado.totalDescontado.toLocaleString()}</span></div>
                    <div>Pagos Ingreso: <span className="font-semibold">RD$ {estado.totalPagosIngreso.toLocaleString()}</span></div>
                    <div>Pagos Egreso: <span className="font-semibold">RD$ {estado.totalPagosEgreso.toLocaleString()}</span></div>
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <p className="font-semibold">Balance Neto: <span className="text-green-600">RD$ {estado.balanceNeto.toLocaleString()}</span></p>
                  </div>
                </div>
              );
            })()}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CooperativaCruzRoja;