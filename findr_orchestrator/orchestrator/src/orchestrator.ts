// orchestrator.ts

import { exec } from 'child_process';
import { writeFile } from 'fs/promises';

export class Orchestrator {
  private terraformPath = './k8s-resources';
  async deploy(params: any): Promise<string> {
    const tfVars = {
      cluster_config: params.cluster_config,
      namespace: params.namespace,
      pod_name: params.pod_name,
      pod_port: params.pod_port,
      container_image: params.container_image,
    };

    await this.createTfVarsFile(tfVars);

    return new Promise((resolve, reject) => {
      exec('terraform init && terraform apply -auto-approve', { cwd: this.terraformPath }, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          reject(error);
        } else {
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
          resolve('Deployment initiated.');
        }
      });
    });
  }

  private async createTfVarsFile(tfVars: any): Promise<void> {
    try {
      await writeFile(`${this.terraformPath}/terraform.tfvars.json`, JSON.stringify(tfVars, null, 2));
    } catch (error) {
      console.error(`File write error: ${error}`);
      throw error;
    }
  }

  async getClusterConfig(): Promise<any> {
    // Logic to fetch cluster configuration
    // This could be reading from a secure source, environment variables, etc.
    const clusterConfig = {
      // Example data structure
      clusterName: process.env.CLUSTER_NAME,
      clusterRegion: process.env.CLUSTER_REGION
      // Do not include sensitive data like credentials or full kubeconfig
    };
    return clusterConfig;
  }
}
