import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getMe } from './login'; // ajuste o caminho conforme necessário

interface Usuario {
    id: number;
    nome: string;
    tipoUsuario: string;
    matricula: string;
    // adicione outras propriedades conforme  response
}

interface UseAuthReturn {
    usuario: Usuario | null;
    loading: boolean;
}

const useAuth = (): UseAuthReturn => {
    const router = useRouter();
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.replace("/login");
                    return;
                }

                const response = await getMe();
                if(!response.ok){
                    router.replace("/login");
                }
                setUsuario(response.usuario);
            } catch (error) {
                console.log(error)
                localStorage.removeItem("token");
                router.replace("/login");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    return { usuario, loading };
};

export default useAuth;
