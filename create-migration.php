<?php

if (php_sapi_name() !== 'cli') {
    die("This script can only be run from the command line.\n");
}

if ($argc < 2) {
    die("Usage: php create-migration.php 'migration name' [plugin]\n");
}

$migrationName = $argv[1];
$kebabCaseName = strtolower(preg_replace('/[^a-z0-9]+/i', '-', trim($migrationName)));
$timestamp = time();
$fileName = "{$timestamp}-{$kebabCaseName}-migration.php";
$migrationsDir = __DIR__ . '/src/app/migrations';

$pluginDir = null;
if (isset($argv[2])) {
    $pluginDir = $argv[2];
}

if ($pluginDir) {
    $pluginPath = __DIR__ . "/web/app/plugins/{$pluginDir}";
    $migrationsPath = "{$pluginPath}/src/migrations";

    if (is_dir($pluginPath)) {
        $migrationsDir = $migrationsPath;
    }
}

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
