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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersData, rolesData] = await Promise.all([
                adminService.getAllUsers(),
                adminService.getAllRoles()
            ]);
            setUsers(usersData);
            setRoles(rolesData);
        } catch (error) {
            console.error("Erreur lors du chargement des données:", error);
            toast.error("Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            console.log("🔄 Tentative de modification du rôle:", { userId, newRole });
            await adminService.updateUserRole(userId, newRole);
            toast.success("Rôle mis à jour avec succès");
            fetchData(); // Recharger les données
        } catch (error) {
            console.error("❌ Erreur lors de la mise à jour du rôle:", error);
            toast.error("Erreur lors de la mise à jour du rôle: " + error.message);
        }
    };

    const openRoleModal = (user) => {
        setSelectedUser(user);
        setShowRoleModal(true);
    };

    const closeRoleModal = () => {
        setSelectedUser(null);
        setShowRoleModal(false);
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'SUPER_ADMIN':
                return 'bg-danger';
            case 'ADMIN':
                return 'bg-warning';
            case 'UTILISATEUR':
                return 'bg-primary';
            default:
                return 'bg-secondary';
        }
    };

    const getStatusBadge = (user) => {
        if (!user.isAccountVerified) {
            return <span className="badge bg-warning">Non vérifié</span>;
        }
        if (!user.estActif) {
            return <span className="badge bg-danger">Inactif</span>;
        }
        return <span className="badge bg-success">Actif</span>;
    };

    if (loading) {
        return (
            <div className="d-flex" style={{ height: "100vh", backgroundColor: "#f5f5f5" }}>
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
        <div className="d-flex" style={{ height: "100vh", backgroundColor: "#f5f5f5" }}>
            <Sidebar />
            
            <div className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>
                <div className="container-fluid">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1 className="fw-bold mb-2" style={{ color: "#1f2937" }}>
                                Panel d'Administration
                            </h1>
                            <p className="text-muted mb-0">
                                Gestion des utilisateurs et des rôles
                            </p>
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="badge bg-danger me-2">Super Admin</span>
                            <span className="text-muted">Accès complet</span>
                        </div>
                    </div>

                    {/* Statistiques */}
                    <div className="row mb-4">
                        <div className="col-md-3">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body text-center">
                                    <h3 className="fw-bold text-primary">{users.length}</h3>
                                    <p className="text-muted mb-0">Utilisateurs totaux</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body text-center">
                                    <h3 className="fw-bold text-success">
                                        {users.filter(u => u.estActif).length}
                                    </h3>
                                    <p className="text-muted mb-0">Utilisateurs actifs</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body text-center">
                                    <h3 className="fw-bold text-warning">
                                        {users.filter(u => !u.isAccountVerified).length}
                                    </h3>
                                    <p className="text-muted mb-0">Non vérifiés</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body text-center">
                                    <h3 className="fw-bold text-info">{roles.length}</h3>
                                    <p className="text-muted mb-0">Rôles disponibles</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table des utilisateurs */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0">
                            <h5 className="fw-bold mb-0">Gestion des Utilisateurs</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Utilisateur</th>
                                            <th>Email</th>
                                            <th>Service</th>
                                            <th>Rôle actuel</th>
                                            <th>Statut</th>
                                            <th>Date création</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                                                             style={{ width: "40px", height: "40px" }}>
                                                            <span className="text-white fw-bold">
                                                                {user.prenom ? user.prenom.charAt(0).toUpperCase() : 
                                                                 user.nom ? user.nom.charAt(0).toUpperCase() : 'U'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="fw-medium">
                                                                {user.prenom} {user.nom}
                                                            </div>
                                                            <small className="text-muted">{user.telephone}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="text-muted">{user.email}</span>
                                                </td>
                                                <td>
                                                    <span className="badge bg-light text-dark">{user.service}</span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    {getStatusBadge(user)}
                                                </td>
                                                <td>
                                                    <small className="text-muted">
                                                        {new Date(user.dateCreation).toLocaleDateString('fr-FR')}
                                                    </small>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => openRoleModal(user)}
                                                        disabled={user.role === 'SUPER_ADMIN'}
                                                    >
                                                        <i className="bi bi-pencil me-1"></i>
                                                        Modifier rôle
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de modification de rôle */}
            {showRoleModal && selectedUser && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1050
                    }}
                    onClick={closeRoleModal}
                >
                    <div 
                        className="modal-content"
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            padding: '0',
                            width: '500px',
                            maxWidth: '90%',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header" style={{ borderBottom: '1px solid #dee2e6', padding: '1rem' }}>
                            <h5 className="modal-title" style={{ margin: 0, fontWeight: '600' }}>Modifier le rôle</h5>
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
                            <p style={{ marginBottom: '1rem' }}>
                                Modifier le rôle de <strong>{selectedUser.prenom} {selectedUser.nom}</strong>
                            </p>
                            <div className="mb-3">
                                <label className="form-label" style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
                                    Nouveau rôle
                                </label>
                                <select 
                                    className="form-select" 
                                    id="newRole"
                                    defaultValue={selectedUser.role}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #ced4da',
                                        borderRadius: '4px',
                                        fontSize: '1rem'
                                    }}
                                >
                                    {roles.map((role) => (
                                        <option key={role.id_role} value={role.nom}>
                                            {role.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer" style={{ borderTop: '1px solid #dee2e6', padding: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={closeRoleModal}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: '1px solid #6c757d',
                                    borderRadius: '4px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                Annuler
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-primary"
                                onClick={() => {
                                    const newRole = document.getElementById('newRole').value;
                                    console.log("🔍 Données utilisateur sélectionné:", selectedUser);
                                    console.log("🎯 ID utilisateur:", selectedUser.id);
                                    console.log("🔄 Nouveau rôle:", newRole);
                                    handleRoleChange(selectedUser.id, newRole);
                                    closeRoleModal();
                                }}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: '1px solid #007bff',
                                    borderRadius: '4px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
