import Sidebar from "../components/Sidebar.jsx";
import { useState, useEffect } from "react";
import { adminService } from "../services/api.js";
import { toast } from "react-toastify";

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('Tous les rôles');
    const [selectedService, setSelectedService] = useState('Tous les services');
    const [deletingUser, setDeletingUser] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    // États pour le suivi des demandes
    const [activeTab, setActiveTab] = useState('users');
    const [requests, setRequests] = useState([]);
    const [requestSearchTerm, setRequestSearchTerm] = useState('');
    const [selectedRequestType, setSelectedRequestType] = useState('Tous les types');
    const [selectedRequestStatus, setSelectedRequestStatus] = useState('Tous');
    const [selectedRequestPriority, setSelectedRequestPriority] = useState('Tous');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showRequestModal, setShowRequestModal] = useState(false);
    
    // États pour le formulaire de création d'utilisateur
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        nom: '',
        prenom: '',
        telephone: '',
        role: 'demandeur',
        service: 'Informatique'
    });
    const [creatingUser, setCreatingUser] = useState(false);
    
    // États pour le formulaire de modification d'utilisateur
    const [editingUser, setEditingUser] = useState({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        role: '',
        service: ''
    });
    const [updatingUser, setUpdatingUser] = useState(false);

    useEffect(() => {
        fetchData();
        
        // Rafraîchir les données toutes les 30 secondes pour les demandes
        const interval = setInterval(() => {
            if (activeTab === 'requests') {
                fetchData();
            }
        }, 30000);
        
        return () => clearInterval(interval);
    }, [activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersData, rolesData, demandesData] = await Promise.all([
                adminService.getAllUsers(),
                adminService.getAllRoles(),
                adminService.getAllDemandes()
            ]);
            setUsers(usersData);
            setRoles(rolesData);
            setRequests(demandesData);
        } catch (error) {
            console.error("Erreur lors du chargement des données:", error);
            toast.error("Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    // Fonctions pour la gestion des utilisateurs
    const openRoleModal = (user) => {
        setSelectedUser(user);
        setEditingUser({
            prenom: user.prenom || '',
            nom: user.nom || '',
            email: user.email || '',
            telephone: user.telephone || '',
            role: user.role || '',
            service: user.service || ''
        });
        setShowRoleModal(true);
    };

    const closeRoleModal = () => {
        setSelectedUser(null);
        setEditingUser({
            prenom: '',
            nom: '',
            email: '',
            telephone: '',
            role: '',
            service: ''
        });
        setShowRoleModal(false);
    };

    const openCreateUserModal = () => {
        setShowCreateUserModal(true);
    };

    const closeCreateUserModal = () => {
        setShowCreateUserModal(false);
        setNewUser({
            email: '',
            password: '',
            nom: '',
            prenom: '',
            telephone: '',
            role: 'demandeur',
            service: 'Informatique'
        });
    };

    const handleCreateUser = async () => {
        try {
            setCreatingUser(true);
            await adminService.createUser(newUser);
            toast.success("Utilisateur créé avec succès");
            closeCreateUserModal();
            fetchData();
        } catch (error) {
            console.error("❌ Erreur lors de la création de l'utilisateur:", error);
            toast.error("Erreur lors de la création de l'utilisateur: " + error.message);
        } finally {
            setCreatingUser(false);
        }
    };

    const handleNewUserChange = (field, value) => {
        setNewUser(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEditingUserChange = (field, value) => {
        setEditingUser(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleUpdateUser = async () => {
        try {
            setUpdatingUser(true);
            await adminService.updateUser(selectedUser.id, editingUser);
            toast.success("Utilisateur mis à jour avec succès");
            closeRoleModal();
            fetchData();
        } catch (error) {
            console.error("❌ Erreur lors de la mise à jour de l'utilisateur:", error);
            toast.error("Erreur lors de la mise à jour de l'utilisateur: " + error.message);
        } finally {
            setUpdatingUser(false);
        }
    };

    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setUserToDelete(null);
        setShowDeleteModal(false);
    };

    const handleDeleteUser = async () => {
        try {
            setDeletingUser(true);
            await adminService.deleteUser(userToDelete.id);
            toast.success("Utilisateur supprimé avec succès");
            closeDeleteModal();
            fetchData();
        } catch (error) {
            console.error("❌ Erreur lors de la suppression de l'utilisateur:", error);
            toast.error("Erreur lors de la suppression de l'utilisateur: " + error.message);
        } finally {
            setDeletingUser(false);
        }
    };

    // Fonctions pour le suivi des demandes
    const openRequestModal = (request) => {
        setSelectedRequest(request);
        setShowRequestModal(true);
    };

    const closeRequestModal = () => {
        setSelectedRequest(null);
        setShowRequestModal(false);
    };

    const getPriorityBadgeColor = (priority) => {
        switch (priority) {
            case 'basse': return 'bg-secondary';
            case 'moyenne': return 'bg-warning text-dark';
            case 'haute': return 'bg-orange';
            case 'critique': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'en cours': return 'bg-primary';
            case 'approuve': return 'bg-success';
            case 'rejete': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'en cours': return 'bi-clock';
            case 'approuve': return 'bi-check-circle';
            case 'rejete': return 'bi-x-circle';
            default: return 'bi-question-circle';
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'demandeur': return 'bg-primary';
            case 'Manager N+1': return 'bg-success';
            case 'SI': return 'bg-purple';
            case 'Direction Générale': return 'bg-danger';
            case 'Support IT': return 'bg-info';
            case 'Administrateur': return 'bg-warning text-dark';
            default: return 'bg-secondary';
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole === 'Tous les rôles' || user.role === selectedRole;
        const matchesService = selectedService === 'Tous les services' || user.service === selectedService;
        return matchesSearch && matchesRole && matchesService;
    });

    const filteredRequests = requests.filter(request => {
        const matchesSearch = request.demandeur?.toLowerCase().includes(requestSearchTerm.toLowerCase()) ||
                            request.titre?.toLowerCase().includes(requestSearchTerm.toLowerCase());
        const matchesType = selectedRequestType === 'Tous les types' || request.type === selectedRequestType;
        const matchesStatus = selectedRequestStatus === 'Tous' || request.statut === selectedRequestStatus;
        const matchesPriority = selectedRequestPriority === 'Tous' || request.priorite === selectedRequestPriority;
        return matchesSearch && matchesType && matchesStatus && matchesPriority;
    });

    if (loading) {
        return (
            <div className="d-flex" style={{ height: "100vh", backgroundColor: "#f8f9fa" }}>
                <Sidebar />
                <div className="flex-grow-1 p-4 d-flex align-items-center justify-content-center">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
                        <p className="mt-3">Chargement du panel d'administration...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex" style={{ height: "100vh", backgroundColor: "#f8f9fa" }}>
            <Sidebar />
            
            <div className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>
                <div className="container-fluid">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1 className="fw-bold mb-1" style={{ color: "#495057", fontSize: "2rem" }}>
                                Administration
                            </h1>
                            <p className="text-muted mb-0" style={{ fontSize: "1rem" }}>
                                Gestion des utilisateurs et suivi des demandes
                            </p>
                        </div>
                        {activeTab === 'users' && (
                            <button 
                                className="btn btn-dark d-flex align-items-center gap-2"
                                onClick={openCreateUserModal}
                            >
                                <i className="bi bi-person-plus"></i>
                                Ajouter un utilisateur
                            </button>
                        )}
                    </div>

                    {/* Statistiques */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body d-flex align-items-center justify-content-between">
                                    <div>
                                        <h3 className="fw-bold mb-1" style={{ fontSize: "2.5rem", color: "#495057" }}>
                                            {users.length}
                                        </h3>
                                        <p className="text-muted mb-0">Total Utilisateurs</p>
                                    </div>
                                    <div className="text-muted">
                                        <i className="bi bi-people" style={{ fontSize: "2rem" }}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body d-flex align-items-center justify-content-between">
                                    <div>
                                        <h3 className="fw-bold mb-1" style={{ fontSize: "2.5rem", color: "#495057" }}>
                                            {requests.length}
                                        </h3>
                                        <p className="text-muted mb-0">Total Demandes</p>
                                    </div>
                                    <div className="text-muted">
                                        <i className="bi bi-file-text" style={{ fontSize: "2rem" }}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Onglets de navigation */}
                    <div className="mb-4">
                        <div className="nav nav-tabs border-0">
                            <button 
                                className={`nav-link ${activeTab === 'users' ? 'active bg-white border-bottom-0' : 'text-muted'}`}
                                style={{ 
                                    border: 'none', 
                                    padding: '1rem 2rem',
                                    borderRadius: '0.5rem 0.5rem 0 0',
                                    fontWeight: activeTab === 'users' ? '600' : '400'
                                }}
                                onClick={() => setActiveTab('users')}
                            >
                                Gestion des Utilisateurs
                            </button>
                            <button 
                                className={`nav-link ${activeTab === 'requests' ? 'active bg-white border-bottom-0' : 'text-muted'}`}
                                style={{ 
                                    border: 'none', 
                                    padding: '1rem 2rem',
                                    borderRadius: '0.5rem 0.5rem 0 0',
                                    fontWeight: activeTab === 'requests' ? '600' : '400'
                                }}
                                onClick={() => setActiveTab('requests')}
                            >
                                Suivi des Demandes
                            </button>
                        </div>
                    </div>

                    {/* Section Gestion des Utilisateurs */}
                    {activeTab === 'users' && (
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <div className="mb-4">
                                    <h4 className="fw-bold mb-1" style={{ color: "#495057" }}>
                                        Utilisateurs du Système
                                    </h4>
                                    <p className="text-muted mb-3">
                                        Gérez les comptes utilisateurs et leurs rôles
                                    </p>
                                    
                                    {/* Barre de recherche et filtres */}
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="input-group">
                                                <span className="input-group-text">
                                                    <i className="bi bi-search"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Rechercher par nom, prénom ou email..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <select 
                                                className="form-select" 
                                                value={selectedRole}
                                                onChange={(e) => setSelectedRole(e.target.value)}
                                            >
                                                <option value="Tous les rôles">Tous les rôles</option>
                                                {roles.filter(role => role.nom !== 'SUPER_ADMIN').map((role) => (
                                                    <option key={role.id_role} value={role.nom}>
                                                        {role.nom}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <select 
                                                className="form-select" 
                                                value={selectedService}
                                                onChange={(e) => setSelectedService(e.target.value)}
                                            >
                                                <option value="Tous les services">Tous les services</option>
                                                <option value="Informatique">Informatique</option>
                                                <option value="RH">RH</option>
                                                <option value="Direction">Direction</option>
                                                <option value="Production">Production</option>
                                                <option value="Qualité">Qualité</option>
                                                <option value="Maintenance">Maintenance</option>
                                                <option value="Finance">Finance</option>
                                                <option value="Logistique">Logistique</option>
                                                <option value="Commercial">Commercial</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Tableau des utilisateurs */}
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Utilisateur</th>
                                                <th>Téléphone</th>
                                                <th>Rôle</th>
                                                <th>Service</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map((user) => (
                                                <tr key={user.id}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div className="user-avatar me-3">
                                                                {user.prenom ? user.prenom.charAt(0).toUpperCase() : 
                                                                 user.nom ? user.nom.charAt(0).toUpperCase() : 'U'}
                                                            </div>
                                                            <div>
                                                                <div className="fw-medium">{user.prenom} {user.nom}</div>
                                                                <div className="text-muted small">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{user.telephone}</td>
                                                    <td>
                                                        <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td>{user.service}</td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => openRoleModal(user)}
                                                                title="Modifier"
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                title="Supprimer"
                                                                onClick={() => openDeleteModal(user)}
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section Suivi des Demandes */}
                    {activeTab === 'requests' && (
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <h4 className="fw-bold mb-1" style={{ color: "#495057" }}>
                                                Demandes en Cours
                                            </h4>
                                            <p className="text-muted mb-0">
                                                Visualisez et suivez toutes les demandes du système
                                            </p>
                                        </div>
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={fetchData}
                                            disabled={loading}
                                            title="Rafraîchir les données"
                                        >
                                            <i className={`bi ${loading ? 'bi-arrow-clockwise spin' : 'bi-arrow-clockwise'} me-1`}></i>
                                            {loading ? 'Actualisation...' : 'Actualiser'}
                                        </button>
                                    </div>
                                    
                                    {/* Barre de recherche et filtres */}
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="input-group">
                                                <span className="input-group-text">
                                                    <i className="bi bi-search"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Rechercher par nom du demandeur..."
                                                    value={requestSearchTerm}
                                                    onChange={(e) => setRequestSearchTerm(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <select 
                                                className="form-select" 
                                                value={selectedRequestType}
                                                onChange={(e) => setSelectedRequestType(e.target.value)}
                                            >
                                                <option value="Tous les types">Tous les types</option>
                                                <option value="ordinateur">Ordinateur</option>
                                                <option value="imprimante">Imprimante</option>
                                                <option value="prise réseau">Prise réseau</option>
                                                <option value="logiciels">Logiciels</option>
                                                <option value="autre">Autre</option>
                                            </select>
                                        </div>
                                        <div className="col-md-2">
                                            <select 
                                                className="form-select" 
                                                value={selectedRequestPriority}
                                                onChange={(e) => setSelectedRequestPriority(e.target.value)}
                                            >
                                                <option value="Tous">Tous</option>
                                                <option value="basse">Basse</option>
                                                <option value="moyenne">Moyenne</option>
                                                <option value="haute">Haute</option>
                                                <option value="critique">Critique</option>
                                            </select>
                                        </div>
                                        <div className="col-md-2">
                                            <select 
                                                className="form-select" 
                                                value={selectedRequestStatus}
                                                onChange={(e) => setSelectedRequestStatus(e.target.value)}
                                            >
                                                <option value="Tous">Tous</option>
                                                <option value="en cours">En cours</option>
                                                <option value="approuve">Approuvé</option>
                                                <option value="rejete">Rejeté</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Tableau des demandes */}
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead className="table-light">
                                            <tr>
                                                <th>ID</th>
                                                <th>Titre</th>
                                                <th>Demandeur</th>
                                                <th>Rôle</th>
                                                <th>Type</th>
                                                <th>Priorité</th>
                                                <th>Statut</th>
                                                <th>Date</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredRequests.map((request) => (
                                                <tr key={request.id}>
                                                    <td className="fw-medium">{request.id}</td>
                                                    <td>{request.titre}</td>
                                                    <td>{request.demandeur}</td>
                                                    <td>
                                                        <span className={`badge ${getRoleBadgeColor(request.role)}`}>
                                                            {request.role}
                                                        </span>
                                                    </td>
                                                    <td>{request.type}</td>
                                                    <td>
                                                        <span className={`badge ${getPriorityBadgeColor(request.priorite)}`}>
                                                            {request.priorite}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${getStatusBadgeColor(request.statut)}`}>
                                                            <i className={`bi ${getStatusIcon(request.statut)} me-1`}></i>
                                                            {request.statut}
                                                        </span>
                                                    </td>
                                                    <td>{request.date}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => openRequestModal(request)}
                                                            title="Voir les détails"
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {/* Modal de modification d'utilisateur */}
            {showRoleModal && selectedUser && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1050
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        width: '90%',
                        maxWidth: '500px',
                        padding: '0'
                    }}>
                        <div className="modal-header" style={{ borderBottom: '1px solid #dee2e6', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h5 className="modal-title fw-bold" style={{ color: '#495057' }}>
                                Modifier l'utilisateur
                            </h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={closeRoleModal}
                                style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '1rem' }}>
                            <p style={{ marginBottom: '1rem', color: '#6c757d' }}>
                                Modifiez les informations de l'utilisateur sélectionné.
                            </p>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Prénom</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={editingUser.prenom}
                                        onChange={(e) => handleEditingUserChange('prenom', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Nom</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={editingUser.nom}
                                        onChange={(e) => handleEditingUserChange('nom', e.target.value)}
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Email</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        value={editingUser.email}
                                        onChange={(e) => handleEditingUserChange('email', e.target.value)}
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Téléphone</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={editingUser.telephone}
                                        onChange={(e) => handleEditingUserChange('telephone', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Rôle</label>
                                    <select 
                                        className="form-select" 
                                        value={editingUser.role}
                                        onChange={(e) => handleEditingUserChange('role', e.target.value)}
                                    >
                                        {roles.filter(role => role.nom !== 'SUPER_ADMIN').map((role) => (
                                            <option key={role.id_role} value={role.nom}>
                                                {role.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Service</label>
                                    <select 
                                        className="form-select" 
                                        value={editingUser.service}
                                        onChange={(e) => handleEditingUserChange('service', e.target.value)}
                                    >
                                        <option value="Informatique">Informatique</option>
                                        <option value="RH">RH</option>
                                        <option value="Direction">Direction</option>
                                        <option value="Production">Production</option>
                                        <option value="Qualité">Qualité</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Logistique">Logistique</option>
                                        <option value="Commercial">Commercial</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer" style={{ borderTop: '1px solid #dee2e6', padding: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={closeRoleModal}
                                disabled={updatingUser}
                            >
                                Annuler
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-dark"
                                onClick={handleUpdateUser}
                                disabled={updatingUser}
                            >
                                {updatingUser ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Sauvegarde...
                                    </>
                                ) : (
                                    'Sauvegarder'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de création d'utilisateur */}
            {showCreateUserModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1050
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        width: '90%',
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <div className="modal-header" style={{ borderBottom: '1px solid #dee2e6', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h5 className="modal-title fw-bold" style={{ color: '#495057' }}>
                                Créer un nouvel utilisateur
                            </h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={closeCreateUserModal}
                                style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '1rem' }}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Prénom *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={newUser.prenom}
                                        onChange={(e) => handleNewUserChange('prenom', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Nom *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={newUser.nom}
                                        onChange={(e) => handleNewUserChange('nom', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Email *</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        value={newUser.email}
                                        onChange={(e) => handleNewUserChange('email', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Mot de passe *</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        value={newUser.password}
                                        onChange={(e) => handleNewUserChange('password', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Téléphone *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={newUser.telephone}
                                        onChange={(e) => handleNewUserChange('telephone', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Rôle *</label>
                                    <select 
                                        className="form-select" 
                                        value={newUser.role}
                                        onChange={(e) => handleNewUserChange('role', e.target.value)}
                                        required
                                    >
                                        {roles.filter(role => role.nom !== 'SUPER_ADMIN').map((role) => (
                                            <option key={role.id_role} value={role.nom}>
                                                {role.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Service *</label>
                                    <select 
                                        className="form-select" 
                                        value={newUser.service}
                                        onChange={(e) => handleNewUserChange('service', e.target.value)}
                                        required
                                    >
                                        <option value="Informatique">Informatique</option>
                                        <option value="RH">RH</option>
                                        <option value="Direction">Direction</option>
                                        <option value="Production">Production</option>
                                        <option value="Qualité">Qualité</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Logistique">Logistique</option>
                                        <option value="Commercial">Commercial</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer" style={{ borderTop: '1px solid #dee2e6', padding: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={closeCreateUserModal}
                                disabled={creatingUser}
                            >
                                Annuler
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-dark"
                                onClick={handleCreateUser}
                                disabled={creatingUser || !newUser.email || !newUser.password || !newUser.nom || !newUser.prenom || !newUser.telephone}
                            >
                                {creatingUser ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Création...
                                    </>
                                ) : (
                                    'Créer l\'utilisateur'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmation de suppression */}
            {showDeleteModal && userToDelete && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1050
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        width: '90%',
                        maxWidth: '400px',
                        padding: '0'
                    }}>
                        <div className="modal-header" style={{ borderBottom: '1px solid #dee2e6', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h5 className="modal-title fw-bold text-danger" style={{ color: '#dc3545' }}>
                                Confirmer la suppression
                            </h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={closeDeleteModal}
                                style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '1rem' }}>
                            <p style={{ marginBottom: '1rem', color: '#6c757d' }}>
                                Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{userToDelete.prenom} {userToDelete.nom}</strong> ?
                            </p>
                            <p style={{ marginBottom: '0', color: '#dc3545', fontSize: '0.9rem' }}>
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                Cette action est irréversible.
                            </p>
                        </div>
                        <div className="modal-footer" style={{ borderTop: '1px solid #dee2e6', padding: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={closeDeleteModal}
                                disabled={deletingUser}
                            >
                                Annuler
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-danger"
                                onClick={handleDeleteUser}
                                disabled={deletingUser}
                            >
                                {deletingUser ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Suppression...
                                    </>
                                ) : (
                                    'Supprimer'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de workflow pour les demandes */}
            {showRequestModal && selectedRequest && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1050
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        width: '90%',
                        maxWidth: '600px',
                        padding: '0'
                    }}>
                        <div className="modal-header" style={{ borderBottom: '1px solid #dee2e6', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h5 className="modal-title fw-bold" style={{ color: '#495057' }}>
                                Workflow - {selectedRequest.titre}
                            </h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={closeRequestModal}
                                style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '1rem' }}>
                            <p className="text-muted mb-3">
                                Suivi du processus de traitement de la demande
                            </p>
                            
                            {/* Détails de la demande */}
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <p><strong>ID:</strong> {selectedRequest.id}</p>
                                    <p><strong>Type:</strong> {selectedRequest.type}</p>
                                </div>
                                <div className="col-md-6">
                                    <p><strong>Demandeur:</strong> {selectedRequest.demandeur}</p>
                                    <p><strong>Priorité:</strong> 
                                        <span className={`badge ${getPriorityBadgeColor(selectedRequest.priorite)} ms-2`}>
                                            {selectedRequest.priorite}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Processus d'approbation enchaîné */}
                            <h6 className="fw-bold mb-3">Processus d'approbation enchaîné</h6>
                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex align-items-center p-3 border rounded">
                                    <div className="me-3">
                                        <i className="bi bi-check-circle text-success" style={{ fontSize: '1.5rem' }}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="mb-1">Demande créée</h6>
                                        <p className="text-muted mb-1">Demandeur</p>
                                        <span className="badge bg-dark">Terminé</span>
                                    </div>
                                </div>
                                
                                <div className="d-flex align-items-center p-3 border rounded">
                                    <div className="me-3">
                                        <i className="bi bi-clock text-primary" style={{ fontSize: '1.5rem' }}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="mb-1">Validation Manager N+1</h6>
                                        <p className="text-muted mb-1">Manager N+1</p>
                                        <span className="badge bg-secondary">En cours</span>
                                    </div>
                                </div>
                                
                                <div className="d-flex align-items-center p-3 border rounded">
                                    <div className="me-3">
                                        <i className="bi bi-exclamation-circle text-muted" style={{ fontSize: '1.5rem' }}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="mb-1">Traitement SI</h6>
                                        <p className="text-muted mb-1">SI</p>
                                        <span className="badge bg-secondary">En attente</span>
                                    </div>
                                </div>
                                
                                <div className="d-flex align-items-center p-3 border rounded">
                                    <div className="me-3">
                                        <i className="bi bi-exclamation-circle text-muted" style={{ fontSize: '1.5rem' }}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="mb-1">Approbation Direction Générale</h6>
                                        <p className="text-muted mb-1">Direction Générale</p>
                                        <span className="badge bg-secondary">En attente</span>
                                    </div>
                                </div>
                            </div>

                            {/* Logique des statuts */}
                            <div className="mt-4 p-3 bg-light rounded">
                                <h6 className="fw-bold mb-2">Logique des statuts</h6>
                                <ul className="list-unstyled mb-0">
                                    <li><strong>"en_cours":</strong> La demande est en cours de traitement chez quelqu'un</li>
                                    <li><strong>"approuvé":</strong> Direction Générale a donné son approbation finale</li>
                                    <li><strong>"rejeté":</strong> Quelqu'un dans la chaîne a refusé la demande</li>
                                </ul>
                                <p className="text-muted mt-2 mb-0">
                                    <strong>Visibilité:</strong> Seule la personne concernée par l'étape actuelle peut voir/agir sur la demande
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer" style={{ borderTop: '1px solid #dee2e6', padding: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={closeRequestModal}
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
