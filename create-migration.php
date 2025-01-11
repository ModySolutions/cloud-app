<?php

if (php_sapi_name() !== 'cli') {
    die("Este script solo puede ejecutarse desde la línea de comandos.\n");
}

if ($argc < 2) {
    die("Use: php create-migration.php 'migration name'\n");
}

$migrationName = $argv[1];
$kebabCaseName = strtolower(preg_replace('/[^a-z0-9]+/i', '-', trim($migrationName)));
$timestamp = time();
$fileName = "{$timestamp}-{$kebabCaseName}-migration.php";
$migrationsDir = __DIR__ . '/src/app/migrations';

if (!is_dir($migrationsDir)) {
    mkdir($migrationsDir, 0755, true);
}

$filePath = $migrationsDir . '/' . $fileName;
$migrationContent = <<<PHP
<?php

return function (\$wpdb) {
    throw new Error('Coding...');
};

PHP;

file_put_contents($filePath, $migrationContent);
echo "Migration created at: $filePath\n";
