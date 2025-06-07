-- Criação de tabela temporária para armazenar resultados
CREATE TEMP TABLE test_results (
    test_name TEXT,
    passed BOOLEAN,
    error_message TEXT
);

-- Função auxiliar para registrar resultados
CREATE OR REPLACE FUNCTION log_test(
    test_name TEXT, 
    passed BOOLEAN, 
    error_message TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO test_results VALUES (test_name, passed, error_message);
END;
$$ LANGUAGE plpgsql;

-- Operações de testes
DO $$
DECLARE
    test_user VARCHAR(63) := 'test_username';
    test_admin VARCHAR(63) := 'test_admin';
    test_airport_iata VARCHAR(3) := 'TST';
    test_airline_sigla VARCHAR(63) := 'TEST_SIGLA';
BEGIN
    -- Insersão de dados conforme definição da tabela
    INSERT INTO Usuario(username, senha, nickname) 
    VALUES (test_user, 'password', 'Test Nickname');
    
    IF EXISTS (SELECT 1 FROM usuario WHERE username = test_user and is_role_admin = false) THEN
        PERFORM log_test('Admin Role Default FALSE', TRUE);
    ELSE
        PERFORM log_test('Admin Role Default FALSE', FALSE, 'Permissão de Admin não foi inicializado como falso');
    END IF;
    
    IF EXISTS (SELECT 1 FROM usuario WHERE username = test_user and data_cadastro = CURRENT_DATE) THEN
        PERFORM log_test('Data Cadastro Default CURRENT_DATE', TRUE);
    ELSE
        PERFORM log_test('Data Cadastro Default CURRENT_DATE', FALSE, 'Data de Cadastro não foi inicializado como hoje');
    END IF;
    
    INSERT INTO Usuario(username, senha, nickname, is_role_admin) 
    VALUES (test_admin, 'password', 'Test Admin', TRUE);
    
    INSERT INTO CompanhiaAerea(sigla, nome)
    VALUES (test_airline_sigla, 'Test Airline');
    
    INSERT INTO Aeroporto(
        iata, icao, pais, cidade, nome, latitude, longitude
    ) VALUES (
        test_airport_iata, 'ICAO', 'Test Country', 'Test City', 'Test Airport', 0, 0
    );
    
    INSERT INTO Comentario(conteudo, usuario_username, aeroporto_iata)
    VALUES ('Comentário de teste', test_user, test_airport_iata);
    
    IF EXISTS (SELECT 1 FROM Comentario WHERE usuario_username = test_user and horario_postagem = CURRENT_TIMESTAMP) THEN
        PERFORM log_test('Horario Postagem Default CURRENT_TIMESTAMP', TRUE);
    ELSE
        PERFORM log_test('Horario Postagem Default CURRENT_TIMESTAMP', FALSE, 'Horario de Postagem não foi inicializado como agora');
    END IF;
    
    INSERT INTO Comentario(conteudo, usuario_username, aeroporto_iata)
    VALUES ('Comentário de teste do admin', test_admin, test_airport_iata);

    -- TESTE 1: NOT NULL para senha do usuário
    BEGIN
        INSERT INTO Usuario(username, nickname) 
        VALUES ('null_senha_user', 'nick');
        PERFORM log_test('NOT NULL senha', FALSE, 'Conseguiu inserir sem senha');
    EXCEPTION WHEN not_null_violation THEN
        PERFORM log_test('NOT NULL senha', TRUE);
    END;
    
    -- TESTE 2: NOT NULL para nickname do usuário
    BEGIN
        INSERT INTO Usuario(username, senha) 
        VALUES ('null_nickname_user', 'password');
        PERFORM log_test('NOT NULL nickname', FALSE, 'Conseguiu inserir sem nickname');
    EXCEPTION WHEN not_null_violation THEN
        PERFORM log_test('NOT NULL nickname', TRUE);
    END;

    -- TESTE 3: CHECK IATA formato
    BEGIN
        INSERT INTO Aeroporto(iata, icao) VALUES ('AaA', 'BBBB');
        PERFORM log_test('CHECK IATA formato', FALSE, 'Inseriu IATA inválido');
    EXCEPTION WHEN check_violation THEN
        PERFORM log_test('CHECK IATA formato', TRUE);
    END;
    
    -- TESTE 4: CHECK ICAO formato
    BEGIN
        INSERT INTO Aeroporto(iata, icao) VALUES ('AAA', 'BBB');
        PERFORM log_test('CHECK ICAO formato', FALSE, 'Inseriu ICAO inválido');
    EXCEPTION WHEN check_violation THEN
        PERFORM log_test('CHECK ICAO formato', TRUE);
    END;

    -- TESTE 5: UNIQUE ICAO
    BEGIN
        INSERT INTO Aeroporto(iata, icao) VALUES ('AAA', 'ICAO');
        PERFORM log_test('UNIQUE ICAO', FALSE, 'Inseriu ICAO duplicado');
    EXCEPTION WHEN unique_violation THEN
        PERFORM log_test('UNIQUE ICAO', TRUE);
    END;
    
    -- TESTE 6: NOT NULL ICAO
    BEGIN
        INSERT INTO Aeroporto(iata) VALUES ('AAA');
        PERFORM log_test('NOT NULL ICAO', FALSE, 'Conseguiu inserir sem ICAO');
    EXCEPTION WHEN not_null_violation THEN
        PERFORM log_test('NOT NULL ICAO', TRUE);
    END;

    -- TESTE 7: CHECK latitude
    BEGIN
        INSERT INTO Aeroporto(iata, icao, latitude) VALUES ('AAA', 'BBBB', 91);
        PERFORM log_test('CHECK latitude', FALSE, 'Inseriu latitude inválida');
    EXCEPTION WHEN check_violation THEN
        PERFORM log_test('CHECK latitude', TRUE);
    END;
    
    -- TESTE 8: CHECK longitude
    BEGIN
        INSERT INTO Aeroporto(iata, icao, longitude) VALUES ('AAA', 'BBBB', 181);
        PERFORM log_test('CHECK longitude', FALSE, 'Inseriu longitude inválida');
    EXCEPTION WHEN check_violation THEN
        PERFORM log_test('CHECK longitude', TRUE);
    END;

	-- TESTE 9: NOT NULL Conteudo
    BEGIN
        INSERT INTO Comentario(usuario_username, aeroporto_iata) 
        VALUES (test_user, test_airport_iata);
        PERFORM log_test('NOT NULL Conteudo', FALSE, 'Conseguiu inserir sem Conteudo');
    EXCEPTION WHEN not_null_violation THEN
        PERFORM log_test('NOT NULL Conteudo', TRUE);
    END;
    
    -- TESTE 10: FOREIGN KEY usuário
    BEGIN
        INSERT INTO Comentario(conteudo, usuario_username, aeroporto_iata) 
        VALUES ('Teste Conteudo', 'usuario_inexistente', test_airport_iata);
        PERFORM log_test('FK usuário', FALSE, 'Inseriu com usuário inválido');
    EXCEPTION WHEN foreign_key_violation THEN
        PERFORM log_test('FK usuário', TRUE);
    END;
    
    -- TESTE 11: FOREIGN KEY IATA
    BEGIN
        INSERT INTO Comentario(conteudo, usuario_username, aeroporto_iata) 
        VALUES ('Teste Conteudo', test_user, 'NIL');
        PERFORM log_test('FK IATA', FALSE, 'Inseriu com IATA inválido');
    EXCEPTION WHEN foreign_key_violation THEN
        PERFORM log_test('FK IATA', TRUE);
    END;
    
    -- TESTE 12: FOREIGN KEY sigla
    BEGIN
        INSERT INTO Comentario(conteudo, usuario_username, companhia_sigla) 
        VALUES ('Teste Conteudo', test_user, 'NOT FOUND');
        PERFORM log_test('FK sigla', FALSE, 'Inseriu com sigla inválido');
    EXCEPTION WHEN foreign_key_violation THEN
        PERFORM log_test('FK sigla', TRUE);
    END;

    -- TESTE 13: FK comentário pai
    BEGIN
        INSERT INTO Comentario(conteudo, usuario_username, comentario_pai_id) 
        VALUES ('Teste Conteudo', test_user, 99999);
        PERFORM log_test('FK comentário pai', FALSE, 'Inseriu com comentário pai inválido');
    EXCEPTION WHEN foreign_key_violation THEN
        PERFORM log_test('FK comentário pai', TRUE);
    END;
    
    -- TESTE 14: Multiplos FK comentário
    BEGIN
        INSERT INTO Comentario(conteudo, usuario_username, aeroporto_iata, companhia_sigla) 
        VALUES ('Teste Conteudo', test_user, test_airport_iata, test_airline_sigla);
        PERFORM log_test('Multiplos FK comentário', FALSE, 'Inseriu comentário com múltiplos FK relacionados');
    EXCEPTION WHEN check_violation THEN
        PERFORM log_test('Multiplos FK comentário', TRUE);
    END;

    -- TESTE 15: ON DELETE CASCADE usuário
    BEGIN
        DELETE FROM Usuario WHERE username = test_user;
        
        IF NOT EXISTS (SELECT 1 FROM Comentario WHERE usuario_username = test_user) THEN
            PERFORM log_test('ON DELETE CASCADE usuário', TRUE);
        ELSE
            PERFORM log_test('ON DELETE CASCADE usuário', FALSE, 'Comentários não foram removidos');
        END IF;
    END;

    -- TESTE 16: ON UPDATE CASCADE aeroporto
    BEGIN
        UPDATE Aeroporto SET iata = 'NEW' WHERE iata = test_airport_iata;
        
        IF EXISTS (SELECT 1 FROM Comentario WHERE aeroporto_iata = 'NEW') THEN
            PERFORM log_test('ON UPDATE CASCADE aeroporto', TRUE);
        ELSE
            PERFORM log_test('ON UPDATE CASCADE aeroporto', FALSE, 'FK não atualizada');
        END IF;
    END;

	DELETE FROM Comentario WHERE usuario_username = test_user OR aeroporto_iata IN (test_airport_iata, 'NEW');
    DELETE FROM Usuario WHERE username in (test_user, test_admin);
    DELETE FROM Aeroporto WHERE iata IN (test_airport_iata, 'NEW');
    DELETE FROM CompanhiaAerea WHERE sigla = test_airline_sigla;
END;
$$ LANGUAGE plpgsql;

SELECT 
    test_name AS "Teste",
    CASE 
        WHEN passed THEN '✅ PASSOU' 
        ELSE '❌ FALHOU' 
    END AS "Resultado",
    COALESCE(error_message, '') AS "Detalhes"
FROM test_results;